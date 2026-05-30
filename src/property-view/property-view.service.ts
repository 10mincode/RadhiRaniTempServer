import { Injectable, Res } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PropertyView } from "src/entities/property-view.entity";
import { Repository } from "typeorm";
import { MoreThan } from "typeorm/browser/find-options/operator/MoreThan.js";


@Injectable()
export class PropertyViewService {
    constructor(
        @InjectRepository(PropertyView)
        private viewRepo: Repository<PropertyView>) { }
    async recordView(propertyId: string, ip: string, userAgent: string) {
        // Check if same IP viewed same property in last 24 hours
        const existing = await this.viewRepo.findOne({
            where: {
                propertyId,
                ipAddress: ip
            }
        });

        if (!existing) {
            // Unique view — record it
            const view = this.viewRepo.create({
                propertyId,
                ipAddress: ip,
                userAgent,
                lastViewedAt: new Date().toISOString()
            });
            await this.viewRepo.save(view);
            return { unique: true };
        } else {
            // Not unique, but we can update the timestamp to extend the "view window"
            existing.lastViewedAt = new Date().toISOString();
            existing.views += 1; // Increment view count for this IP
            await this.viewRepo.save(existing);
        }

        return { unique: false };
    }

    async getViewStats(propertyId: string) {
        const allRows = await this.viewRepo.find({ where: { propertyId } });

        // Total views = sum of all views column
        const totalViews = allRows.reduce((sum, row) => sum + row.views, 0);

        // Unique visitors = count of distinct IPs
        const uniqueIps = new Set(allRows.map(r => r.ipAddress));
        const uniqueVisitors = uniqueIps.size;

        // Today's views
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayRows = allRows.filter(r => r.lastViewedAt > today.toISOString());
        const todayViews = todayRows.reduce((sum, row) => sum + row.views, 0);
        const todayUnique = new Set(todayRows.map(r => r.ipAddress)).size;

        return { totalViews, uniqueVisitors, todayViews, todayUnique };
    }

    async getTotalStats() {
        const allRows = await this.viewRepo.find();

        const totalViews = allRows.reduce((sum, row) => sum + row.views, 0);
        const uniqueVisitors = new Set(allRows.map(r => r.ipAddress && r.propertyId)).size;
        // Per property breakdown
        const perProperty = new Map<string, { totalViews: number, uniqueVisitors: number }>();
        allRows.forEach(row => {
            if (!perProperty.has(row.propertyId)) {
                perProperty.set(row.propertyId, { totalViews: 0, uniqueVisitors: 0 });
            }
            const stat = perProperty.get(row.propertyId)!;
            stat.totalViews += row.views;
        });

        // Unique per property
        allRows.forEach(row => {
            const stat = perProperty.get(row.propertyId)!;
            const uniqueIps = new Set(
                allRows.filter(r => r.propertyId === row.propertyId).map(r => r.ipAddress)
            );
            stat.uniqueVisitors = uniqueIps.size;
        });

        return {
            totalViews,
            uniqueVisitors,
            perProperty: Object.fromEntries(perProperty)
        };
    }
    async exportViews(res: any) {
        const views = await this.viewRepo.find({ order: { lastViewedAt: 'DESC' } });
        const csv = [
            'propertyId,ipAddress,userAgent,views,lastViewedAt',
            ...views.map(v =>
                `${v.propertyId},${v.ipAddress},"${v.userAgent}",${v.views},${v.lastViewedAt}`
            )
        ].join('\n');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=views.csv');
        res.send(csv);
    }
}
