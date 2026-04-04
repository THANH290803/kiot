# Folder Structure

```text
src/
├── app/
│   ├── admin/
│   │   ├── login/
│   │   └── (protected)/
│   ├── user/
│   ├── payment/
│   ├── layout.tsx
│   ├── page.tsx
│   └── providers.tsx
├── features/
│   ├── admin/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   └── providers/
│   └── user/
│       ├── components/
│       ├── lib/
│       └── providers/
├── shared/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   │   ├── api/
│   │   └── providers/
│   ├── types/
│   └── utils/
├── components/
│   └── ui/
├── lib/
│   ├── api.ts
│   ├── permissions.ts
│   └── utils.ts
└── types/
```

## Ownership

- `app/*`: routing, layout, route-level composition.
- `features/admin/*`: nghiệp vụ dashboard/admin operations.
- `features/user/*`: storefront demo flow.
- `shared/*`: code dùng chung nhiều feature.
- `components/ui/*`: primitives của UI kit.
