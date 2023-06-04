import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/lib/prismadb";
import { get } from "http";

interface IParams {
    reservationId?: string;
};

export const dynamic = 'auto';

export async function DELETE(
    request: Request,
    { params }: { params:IParams }

){
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
        return NextResponse.error();
    }

    const { reservationId } = params;

    if (!reservationId || typeof reservationId != 'string'){
        throw new Error('Inalid ID');
    }

    const reservation = await prisma.reservation.deleteMany({
        where: {
            id: reservationId,
            OR: [
                { userId: currentUser.id },
                { listing: {userId: currentUser.id }}
            ]
        }
    });

    return NextResponse.json(reservation);
}

