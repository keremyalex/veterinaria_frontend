import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Mark } from '../../interfaces/ventas.interface';

interface MarkFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { name: string; description: string }) => Promise<void>;
  mark?: Mark | null;
}

export function MarkFormDialog({ open, onClose, onSave, mark }: MarkFormDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (mark) {
      setFormData({
        name: mark.name,
        description: mark.description || ''
      });
    } else {
      setFormData({
        name: '',
        description: ''
      });
    }
  }, [mark, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsSubmitting(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error al guardar marca:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mark ? 'Editar Marca' : 'Agregar Nueva Marca'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="mark-name">Nombre *</Label>
              <Input
                id="mark-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nombre de la marca"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="mark-description">Descripción</Label>
              <Input
                id="mark-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descripción de la marca"
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={!formData.name.trim() || isSubmitting}
            >
              {isSubmitting ? 'Guardando...' : (mark ? 'Actualizar' : 'Crear')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}