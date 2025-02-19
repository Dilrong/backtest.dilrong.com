import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

interface ErrorDialogProps {
  errorMessage: string | null;
  onClose: () => void;
}

export function ErrorDialog({ errorMessage, onClose }: ErrorDialogProps) {
  return (
    <Dialog open={!!errorMessage} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>Error</DialogTitle>
        <DialogDescription>{errorMessage}</DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
