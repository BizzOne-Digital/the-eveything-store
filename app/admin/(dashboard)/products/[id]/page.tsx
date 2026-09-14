import { notFound } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import ProductForm from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();
  const product = await Product.findById(id).lean();
  if (!product) notFound();

  const initialValues = {
    name: product.name,
    slug: product.slug,
    shortDescription: product.shortDescription || "",
    description: product.description || "",
    category: String(product.category),
    subCategory: product.subCategory || "",
    brand: product.brand || "",
    sku: product.sku || "",
    price: product.price,
    salePrice: product.salePrice ?? "",
    stock: product.stock,
    lowStockThreshold: product.lowStockThreshold,
    featured: product.featured,
    status: product.status,
    images: product.images || [],
    mainImage: product.mainImage || "",
    tags: product.tags || [],
    specifications: product.specifications || [],
    seoTitle: product.seoTitle || "",
    seoDescription: product.seoDescription || "",
  };

  return (
    <div className="max-w-6xl">
      <ProductForm mode="edit" productId={id} initialValues={initialValues} />
    </div>
  );
}
