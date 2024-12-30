import express, { Request, Response } from "express";
import { request } from "http";
import { mock } from "node:test";

const app = express();

app.use(express.json())

const PORT = process.env.PORT || 3000;

const mockUsers = [
  { id: 1, username: "amr", displayName: "Amr"},
  { id: 2, username: "ahmed", displayName: "Ahmed"},
  { id: 3, username: "ali", displayName: "Ali"},
  { id: 4, username: "tamer", displayName: "Tamer"},
  { id: 5, username: "omir", displayName: "Omir"},
  { id: 6, username: "samer", displayName: "Samer"},
  { id: 7, username: "hussein", displayName: "Hussein"}
];

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript + Express!");
});

app.get('/api/users', (req: Request, res:Response) => {
  console.log(req.query);
  const { 
    query: { filter, value },
  } = req;

  if (filter && value && typeof filter === 'string' && (filter === 'username' || filter === 'displayName')) {
    return res.send(
      mockUsers.filter((user) => user[filter].includes(value as string))
    );
    
  }
  return res.send(mockUsers);
});

app.post("/api/users", (req: Request, res: Response) => {
  console.log(req.body);
  const { body } = req
  const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...body }
  mockUsers.push(newUser);

  return res.status(201).send(newUser);

}) 

app.get("/api/users/:id", (req: Request, res: Response) => {
  console.log(req.params);
  const parsedId = parseInt(req.params.id);
  if (isNaN(parsedId)) return res.status(400).send({ msg: "Bad Request. Invalid Id."});

  const findUser = mockUsers.find((user) => user.id === parsedId);
  if (!findUser) return res.sendStatus(404);
  return res.send(findUser);

});

app.get("/api/products", (req: Request, res: Response) => {
  res.send([
    { id: 123, name: "Chicken", price: 19.99 },
    { id: 124, name: "Syrian Pommes", price: 14.99 },
    { id: 125, name: "Falafel", price: 5.99 },

  ]);
});

app.put("/api/users/:id", (req: Request, res: Response) => {
  const { 
    body, 
    params: { id },
   } = req;

   const parsedId = parseInt(id);
   if (isNaN(parsedId)) return res.sendStatus(400);

   const findUserIndex = mockUsers.findIndex(
    (user) => user.id === parsedId
   )

   if (findUserIndex === -1) return res.sendStatus(404);

   mockUsers[findUserIndex] = { id: parsedId, ...body };

   return res.sendStatus(200);
})

app.patch("/api/users/:id", (req: Request, res: Response) => {
  const { 
    body, 
    params: { id },
   } = req;

   const parsedId = parseInt(id);
   if (isNaN(parsedId)) return res.sendStatus(400);

   const findUserIndex = mockUsers.findIndex(
    (user) => user.id === parsedId
   )

   if (findUserIndex === -1) return res.sendStatus(404);
   
   mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };

    return res.sendStatus(200);
})

app.delete("/api/users/:id", (req: Request, res: Response) => {
  const { params: { id } } = req;
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return res.sendStatus(400);

  const findUserIndex = mockUsers.findIndex(
    (user) => user.id === parsedId
  )

  if (findUserIndex === -1) return res.sendStatus(404);

  mockUsers.splice(findUserIndex, 1); 

  return res.sendStatus(204);
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
