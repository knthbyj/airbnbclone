import prisma from "@/app/lib/prismadb"

export const dynamic = 'auto';
export interface IListingsParams {
    userId?: string;
    guestCount?: number;
    roomCount?: number;
    bathroomCount?: number;
    startDate?: string;
    endDate?: string;
    locationValue?: string;
    category?: string;
}

export default async function getListings(
    params:IListingsParams
) {
    try {
        const { 
            userId,
            guestCount,
            roomCount,
            bathroomCount,
            locationValue,
            startDate,
            endDate,
            category,
        } = params;

        let query: any = {};

        if (userId) {
            query.userId = userId;
        }

        if (category) {
            query.category = category;
        }

        if (roomCount) {
            query.roomCount = {
                gte: +roomCount//adding plus sign in front converts string to number format
            }
        }
        if (bathroomCount) {
            query.bathroomCount = {
                gte: +bathroomCount//adding plus sign in front converts string to number format
            }
        }
        if (guestCount) {
            query.guestCount = {
                gte: +guestCount//adding plus sign in front converts string to number format
            }
        }

        if (locationValue) {
            query.locationValue = locationValue;
        }

        if (startDate && endDate) {
            query.NOT = {
                reservations: {
                    some: {
                        OR: [
                            {
                                endDate: { gte: startDate },
                                startDate: { lte: startDate },
                            },
                            {
                                startDate: { lte: endDate },
                                endDate: { gte: endDate },
                            }
                        ]
                    }
                }
            }
        }

        const listings = await prisma.listing.findMany({
            where: query,
            orderBy: {
                createdAt: 'desc'
            }
        });

        const safeListings = listings.map((listing) => ({
            ...listing,
            createdAt: listing.createdAt.toISOString(),
        }));
        return safeListings;
    } catch (error: any) {
        throw new Error(error);
    }
}