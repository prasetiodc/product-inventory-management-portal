import { Button, Modal } from '@/components/ui';
import { Product } from '@/types';
import { useDeleteProductOptimistic } from '../hooks';

interface DeleteConfirmationModalProps {
 deletingProduct: Product | null; 
 setDeletingProduct: (product: Product | null) => void 
}

const DeleteConfirmationModal = ({deletingProduct, setDeletingProduct}: DeleteConfirmationModalProps) => {
const { deleteProduct, ToastEl } = useDeleteProductOptimistic();

  const handleConfirm = () => {
    if (deletingProduct) {
      deleteProduct(deletingProduct);
    }
    setDeletingProduct(null);
  };

  return (
    <>
      <Modal
        isOpen={Boolean(deletingProduct)}
        onClose={() => setDeletingProduct(null)}
        title="Hapus Produk?"
        maxWidth="sm"
        footer={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeletingProduct(null)}
            >
              Batal
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleConfirm}
            >
              Hapus
            </Button>
          </>
        }
      >
        <p className="text-zinc-500">
          {`Apakah Anda yakin ingin menghapus "${deletingProduct?.title}"?`}
        </p>
      </Modal>
      {ToastEl}
    </>
  );
};

export default DeleteConfirmationModal