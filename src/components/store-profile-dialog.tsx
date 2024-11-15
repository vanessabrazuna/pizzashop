import { z } from "zod"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { 
  DialogClose,
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "./ui/dialog"

import { 
  GetManagedRestaurantResponse, getManagedRestaurant 
} from "@/api/get-managed-restaurant"
import { updateProfile } from "@/api/update-profile"

const storeProfileSchema = z.object({
  name: z.string().min(1),
  description: z.string().nullable(),
})

type StoreProfileData = z.infer<typeof storeProfileSchema>

export function StoreProfileDialog() {
  const queryClient = useQueryClient()

  const { data: managedRestaurant } =
    useQuery({
      queryKey: ["managed-restaurant"],
      queryFn: getManagedRestaurant,
      staleTime: Infinity,
    })

    const { register, handleSubmit, formState: { isSubmitting } } = useForm<StoreProfileData>({
      resolver: zodResolver(storeProfileSchema),
      values: {
        name: managedRestaurant?.name ?? '',
        description: managedRestaurant?.description ?? '',
      },
    })

    function updateManageRestaurantCache({ name, description }: StoreProfileData) {
      const cached = queryClient.getQueryData<GetManagedRestaurantResponse>(['managed-restaurant',])

      if (cached) {
        queryClient.setQueryData<GetManagedRestaurantResponse>(
          ['managed-restaurant'],
          {
            ...cached,
            name,
            description,
          },
        )
      }

      return { cached }
    }

    const { mutateAsync: updateProfileFn } = useMutation({
      mutationFn: updateProfile,
      // Interface Otimista
      onMutate({ name, description }) {
        const { cached } = updateManageRestaurantCache({ name, description })

        return { previousProfile: cached }
      },
      onError(_, __, context) {
        if (context?.previousProfile) {
          updateManageRestaurantCache(context.previousProfile)
        }
      },
    })

    async function handleUpdateProfile( data: StoreProfileData) {
      try {
        await updateProfileFn({ name: data.name, description: data.description })
        toast.success('Seu perfil foi atualizado com sucesso.', {
          position: "top-right",
        })
      } catch {
        toast.error('Não foi possível atualizar seu perfil. Tente novamente.', {
          position: "top-right",
        })
      }
    }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Perfil da loja</DialogTitle>
        <DialogDescription>
          Atualize as informações do seu estabelecimento visíveis ao seu cliente
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(handleUpdateProfile)}>
      <div className="space-y-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" htmlFor="name">
              Nome
            </Label>
            <Input className="col-span-3" id="name" {...register('name')} />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" htmlFor="description">
              Descrição
            </Label>
            <Textarea
              className="col-span-3"
              id="description"
              {...register('description')}
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" type="button">Cancelar</Button>
          </DialogClose>
          <Button variant="success" type="submit" disabled={isSubmitting}>
            Salvar
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}