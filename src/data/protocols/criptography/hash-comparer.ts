export interface HashComparer {
  compare: (password: string, hashPassword: string) => Promise<boolean>
}
