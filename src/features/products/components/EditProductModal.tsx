import { Button, Input, Modal } from "@/components/ui";
import { Product } from "@/types";
import { useUpdateProductOptimistic } from "../hooks";

interface EditForm {
  title: string;
  price: number;
  stock: number;
}

interface EditProductModalProps {
  editingProduct: Product | null;
  setEditingProduct: (product: Product | null) => void;
  editForm: EditForm;
  setEditForm: (form: EditForm) => void;
}

const EditProductModal = ({
  editingProduct,
  setEditingProduct,
  editForm,
  setEditForm,
}: EditProductModalProps) => {
  const { updateProduct, ToastEl } = useUpdateProductOptimistic();

  const handleSave = () => {
    if (!editingProduct) return;

    const updatedProduct: Product = { ...editingProduct, ...editForm };
    void updateProduct(editingProduct, updatedProduct);
    setEditingProduct(null);
  };

  return (
    <>
      <Modal
        isOpen={Boolean(editingProduct)}
        onClose={() => setEditingProduct(null)}
        title="Ubah Produk"
        description="Perbarui informasi dasar produk langsung dari daftar."
        maxWidth="md"
        footer={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditingProduct(null)}
            >
              Batal
            </Button>
            <Button variant="primary" size="sm" onClick={handleSave}>
              Simpan
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Nama Produk"
            value={editForm.title}
            onChange={(e) =>
              setEditForm({ ...editForm, title: e.target.value })
            }
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Harga ($)"
              type="number"
              value={editForm.price}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  price: parseFloat(e.target.value) || 0,
                })
              }
            />

            <Input
              label="Stok"
              type="number"
              value={editForm.stock}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  stock: parseInt(e.target.value, 10) || 0,
                })
              }
            />
          </div>
        </div>
      </Modal>
      {ToastEl}
    </>
  );
};

export default EditProductModal;