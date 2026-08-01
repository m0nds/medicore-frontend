import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { getRouteApi } from '@tanstack/react-router'
import { toast } from 'sonner'
import { loginSchema, type LoginBody } from '@/schemas/auth.schema'
import { useLogin } from '@/hooks/useAuth'
import { userService } from '@/services/user.service'
import { useAuthStore } from '@/stores/auth.store'
import { roleHomePath, type RoleHomePath } from '@/lib/portal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldGroup, FieldLabel, FieldError } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const route = getRouteApi('/_auth/login')

export const Login = () => {
  const navigate = route.useNavigate()
  const { redirect } = route.useSearch()
  const login = useLogin()

  const form = useForm<LoginBody>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const { errors } = form.formState

  const onSubmit = (values: LoginBody) => {
    login.mutate(values, {
      onSuccess: async () => {
        const me = await userService.getUser()
        if (me?.data) {
          useAuthStore.getState().setUser(me.data)
          toast.success(`You're logged in successfully as a ${me.data.role.toLowerCase()}`)
          navigate({ to: (redirect || roleHomePath(me.data.role)) as RoleHomePath })
        }
      },
    })
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Enter your credentials to access your portal.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field data-invalid={!!errors.email}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                aria-invalid={!!errors.email}
                {...form.register('email')}
              />
              <FieldError errors={errors.email ? [errors.email] : undefined} />
            </Field>

            <Field data-invalid={!!errors.password}>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                aria-invalid={!!errors.password}
                {...form.register('password')}
              />
              <FieldError errors={errors.password ? [errors.password] : undefined} />
            </Field>

            <Button type="submit" disabled={login.isPending}>
              {login.isPending ? <Spinner data-icon="inline-start" /> : null}
              Sign in
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
