import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/lib/website/data";
import { connectDB } from "@/lib/mongodb";
import { Category } from "@/models/Category";
import { formatPrice } from "@/lib/utils";
import Breadcrumbs from "@/components/website/Breadcrumbs";
import ProductGallery from "@/components/website/ProductGallery";
import ProductActions from "@/components/website/ProductActions";
import ProductGrid from "@/components/website/ProductGrid";
import RecentlyViewed from "@/components/website/RecentlyViewed";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.seoTitle || product.name,
    description: product.seoDescription || product.shortDescription || product.description?.slice(0, 160),
  };
}

async function getCategoryInfo(categoryId: string) {
  try {
    await connectDB();
    const doc = await Category.findById(categoryId).lean<{ name: string; slug: string }>();
    return doc ? { name: doc.name, slug: doc.slug } : null;
  } catch {
    return null;
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [category, related] = await Promise.all([
    getCategoryInfo(product.category),
    getRelatedProducts(product.category, product._id, 4),
  ]);

  const onSale = !!product.salePrice && product.salePrice > 0 && product.salePrice < product.price;
  const images = product.images.length > 0 ? product.images : [product.mainImage];

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription || product.description,
    sku: product.sku,
    brand: product.brand ? { "@type": "Brand", name: product.brand } : undefined,
    image: images.filter(Boolean),
    offers: {
      "@type": "Offer",
      priceCurrency: "CAD",
      price: onSale ? product.salePrice : product.price,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-8 sm:py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <Breadcrumbs
        items={[
          { label: "Shop", href: "/shop" },
          ...(category ? [{ label: category.name, href: `/shop?category=${category.slug}` }] : []),
          { label: product.name },
        ]}
      />

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-10">
        <ProductGallery images={images} name={product.name} />

        <div>
          {category && (
            <p className="text-xs font-bold uppercase tracking-wide text-tes-gold-dark">{category.name}</p>
          )}
          <h1 className="mt-1.5 font-display text-2xl sm:text-3xl font-bold text-tes-black">{product.name}</h1>

          <div className="mt-3 flex items-baseline gap-3">
            <span className="text-2xl font-bold text-tes-black">
              {formatPrice(onSale ? (product.salePrice as number) : product.price)}
            </span>
            {onSale && <span className="text-base text-tes-muted line-through">{formatPrice(product.price)}</span>}
          </div>

          <p className="mt-2 text-sm font-medium">
            {product.stock > 0 ? (
              <span className="text-emerald-700">In Stock ({product.stock} available)</span>
            ) : (
              <span className="text-red-600">Out of Stock</span>
            )}
          </p>

          {product.shortDescription && (
            <p className="mt-4 text-sm leading-relaxed text-tes-muted">{product.shortDescription}</p>
          )}

          <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
            {product.sku && (
              <div>
                <dt className="text-tes-muted">SKU</dt>
                <dd className="font-medium text-tes-black">{product.sku}</dd>
              </div>
            )}
            {product.brand && (
              <div>
                <dt className="text-tes-muted">Brand</dt>
                <dd className="font-medium text-tes-black">{product.brand}</dd>
              </div>
            )}
          </dl>

          <div className="mt-6">
            <ProductActions product={product} />
          </div>
        </div>
      </div>

      {product.description && (
        <section className="mt-14 max-w-3xl">
          <h2 className="font-display text-xl font-bold text-tes-black mb-3">Description</h2>
          <p className="text-sm leading-relaxed text-tes-muted whitespace-pre-line">{product.description}</p>
        </section>
      )}

      {product.specifications.length > 0 && (
        <section className="mt-10 max-w-3xl">
          <h2 className="font-display text-xl font-bold text-tes-black mb-3">Specifications</h2>
          <div className="overflow-x-auto rounded-xl border border-tes-border">
            <table className="w-full text-sm">
              <tbody>
                {product.specifications.map((spec, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-tes-cream"}>
                    <td className="px-4 py-2.5 font-medium text-tes-black w-1/3">{spec.key}</td>
                    <td className="px-4 py-2.5 text-tes-muted">{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-tes-black mb-6">Related Products</h2>
          <ProductGrid products={related} />
        </section>
      )}

      <RecentlyViewed excludeSlug={product.slug} />
    </div>
  );
}
