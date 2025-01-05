import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Product, { IProduct } from "@/models/Product.model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(){
    try {
        await connectDB()
        const products = await Product.find({}).lean()
        if(!products){
            return NextResponse.json(
                { error:"No Products found"},{status:404}
            )
        }
        return NextResponse.json(
            { products},{status:200}
        )
    } catch (error) {
        return NextResponse.json(
            { error:"Unable to find products"},{status:500}
        )
    }
}

export async function POST(request:NextRequest){
    try {
        const session = await getServerSession(authOptions)
        if (!session || session.user?.role !== 'admin') {
            return NextResponse.json(
                { error: "Unauthorized" }, { status: 401 }
            )
        }

        await connectDB()
        const body: IProduct = await request.json()

        if (!body.name || !body.description || !body.imageUrl || body.variants.length === 0) {
            return NextResponse.json(
                { error: "All fields are required" }, { status: 201 }
            )
        }

        const newProduct = await Product.create(body);
        return NextResponse.json({newProduct},{status:201})
    } catch (error) {
        console.log("Error creating a new product/image")
        return NextResponse.json(
            { error: "All fields are required" }, { status: 201 }
        )
    }


}