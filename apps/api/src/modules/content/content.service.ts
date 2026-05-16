import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

type VehicleCatalogModel = {
  value: string;
  label: string;
  years: number[];
};

type VehicleCatalogMake = {
  value: string;
  label: string;
  models: VehicleCatalogModel[];
};

@Injectable()
export class ContentService {
  constructor(private prisma: DatabaseService) {}

  async getFeaturedModels() {
    return this.prisma.featuredModel.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });
  }

  async getVehicleCatalog(): Promise<{ makes: VehicleCatalogMake[] }> {
    const [vehicles, featuredModels] = await Promise.all([
      this.prisma.vehicle.findMany({
        where: { isActive: true },
        select: { make: true, model: true, year: true },
        distinct: ['make', 'model', 'year'],
        orderBy: [{ make: 'asc' }, { model: 'asc' }, { year: 'desc' }],
      }),
      this.prisma.featuredModel.findMany({
        where: { isActive: true },
        select: { filterMake: true, filterModel: true, years: true, order: true },
        orderBy: { order: 'asc' },
      }),
    ]);

    const catalog = new Map<string, Map<string, Set<number>>>();

    const addEntry = (make?: string | null, model?: string | null, years: number[] = []) => {
      const normalizedMake = make?.trim();
      const normalizedModel = model?.trim();

      if (!normalizedMake || !normalizedModel) return;

      if (!catalog.has(normalizedMake)) {
        catalog.set(normalizedMake, new Map());
      }

      const models = catalog.get(normalizedMake)!;
      if (!models.has(normalizedModel)) {
        models.set(normalizedModel, new Set());
      }

      const yearSet = models.get(normalizedModel)!;
      years.filter((year) => Number.isFinite(year) && year > 1900).forEach((year) => yearSet.add(year));
    };

    vehicles.forEach((vehicle) => addEntry(vehicle.make, vehicle.model, [vehicle.year]));
    featuredModels.forEach((model) =>
      addEntry(model.filterMake, model.filterModel, this.parseFeaturedYears(model.years)),
    );

    const makes = Array.from(catalog.entries())
      .map(([make, models]) => ({
        value: make,
        label: this.toDisplayLabel(make),
        models: Array.from(models.entries())
          .map(([model, years]) => ({
            value: model,
            label: this.toDisplayLabel(model),
            years: Array.from(years).sort((a, b) => b - a),
          }))
          .sort((a, b) => a.label.localeCompare(b.label)),
      }))
      .sort((a, b) => a.label.localeCompare(b.label));

    return { makes };
  }

  async createFeaturedModel(data: any) {
    return this.prisma.featuredModel.create({
      data,
    });
  }

  async updateFeaturedModel(id: string, data: any) {
    return this.prisma.featuredModel.update({
      where: { id },
      data,
    });
  }

  async deleteFeaturedModel(id: string) {
    return this.prisma.featuredModel.delete({
      where: { id },
    });
  }

  private parseFeaturedYears(value?: string | null): number[] {
    if (!value) return [];

    const trimmed = value.trim();
    const rangeMatch = trimmed.match(/^(\d{4})\s*-\s*(\d{4})$/);
    if (rangeMatch) {
      const start = Number(rangeMatch[1]);
      const end = Number(rangeMatch[2]);
      if (Number.isFinite(start) && Number.isFinite(end) && end >= start) {
        return Array.from({ length: end - start + 1 }, (_, index) => start + index);
      }
    }

    return trimmed
      .split(',')
      .map((entry) => Number(entry.trim()))
      .filter((year) => Number.isFinite(year));
  }

  private toDisplayLabel(value: string): string {
    return value
      .toLowerCase()
      .split(/[\s-]+/)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }
}
