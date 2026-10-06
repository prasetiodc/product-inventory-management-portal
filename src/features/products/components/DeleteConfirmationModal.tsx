import { Button, Modal } from '@/components/ui';
import { Product } from '@/types';

interface DeleteConfirmationModalProps {
 deletingProduct: Product | null; 
 setDeletingProduct: (product: Product | null) => void 
}

const DeleteConfirmationModal = ({deletingProduct, setDeletingProduct}: DeleteConfirmationModalProps) => {
  return (
    <Modal
        isOpen={Boolean(deletingProduct)}
        onClose={() => setDeletingProduct(null)}
        title="Hapus Produk?"
        description={`Apakah Anda yakin ingin menghapus "${deletingProduct?.title}"? Tindakan ini dapat dibatalkan melalui fitur rollback jika mutation gagal.`}
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
              onClick={() => {
                alert(`Produk "${deletingProduct?.title}" dihapus!`);
                setDeletingProduct(null);
              }}
            >
              Hapus
            </Button>
          </>
        }
      >
        <p className="text-xs text-zinc-500">
          Data akan dihapus secara optimistik dari tabel sebelum konfirmasi respons server diterima.
        </p>
      </Modal>
  )
}

export default DeleteConfirmationModal