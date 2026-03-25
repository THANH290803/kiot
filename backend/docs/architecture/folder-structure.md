# Folder Structure

```text
backend/
├── migrations/
├── src/
│   ├── app.js
│   ├── config/
│   │   └── config.js
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── swagger/
│   └── utils/
├── .sequelizerc
├── package.json
└── Dockerfile
```

## Trách nhiệm từng phần

- `migrations/`: schema changes theo thời gian.
- `src/config/config.js`: cấu hình Sequelize theo môi trường.
- `src/models/index.js`: init model + associations.
- `src/routes/*`: chia route theo module domain.
- `src/controllers/*`: xử lý request/response.
