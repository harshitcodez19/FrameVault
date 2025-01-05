import { connectDB } from "@/lib/db";
import Product from "@/models/Product.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request:NextRequest,props:{params:Promise<{id:string}>}){
    try {
        const {id} = await props.params;
        await connectDB()
        const product = await Product.findById(id).lean()

        if(!product){
            return NextResponse.json({error:"Np product found"},{status:404})
        }

        return NextResponse.json({product},{status:200})
    } catch (error) {
        return NextResponse.json({error:"Failed to fetch product from db"},{status:500})
    }
}