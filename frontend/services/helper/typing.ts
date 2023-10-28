export type ServiceReturn<T extends () => unknown> = Awaited<ReturnType<T>>
