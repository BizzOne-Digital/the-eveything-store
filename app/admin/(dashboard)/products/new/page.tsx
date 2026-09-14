import ProductForm from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div className="max-w-6xl">
      <ProductForm mode="create" />
    </div>
  );
}
