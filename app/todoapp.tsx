import * as SQLite from "expo-sqlite";
import { useEffect, useState } from "react";
import { View, ScrollView, Text, Modal, Alert } from "react-native";
import { Appbar, Button, Checkbox, Surface, TextInput, SegmentedButtons } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

type Todo = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  completed: number;
};

const db = SQLite.openDatabaseAsync("shopping.db", { useNewConnection: true });

export default function ShoppingTodo() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Elektronik");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [editVisible, setEditVisible] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Inisialisasi database
  async function initDB() {
    const database = await db;
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        description TEXT,
        price REAL,
        category TEXT,
        completed INTEGER
      );
    `);
    loadTodos();
  }

  useEffect(() => {
    initDB();
  }, []);

  async function loadTodos() {
    const database = await db;
    const result = await database.getAllAsync<Todo>("SELECT * FROM todos ORDER BY id DESC");
    setTodos(result);
  }

  async function addTodo() {
    if (!name.trim()) return;
    const database = await db;
    await database.runAsync(
      "INSERT INTO todos (name, description, price, category, completed) VALUES (?, ?, ?, ?, ?)",
      [name, description, Number(price) || 0, category, 0]
    );
    setName("");
    setDescription("");
    setPrice("");
    setCategory("Elektronik");
    loadTodos();
  }

  async function deleteTodo(id: number) {
    const database = await db;
    await database.runAsync("DELETE FROM todos WHERE id = ?", [id]);
    loadTodos();
  }

  async function toggleTodo(id: number, current: number) {
    const database = await db;
    await database.runAsync("UPDATE todos SET completed = ? WHERE id = ?", [current ? 0 : 1, id]);
    loadTodos();
  }

  function openEdit(todo: Todo) {
    setSelectedId(todo.id);
    setName(todo.name);
    setDescription(todo.description);
    setPrice(todo.price.toString());
    setCategory(todo.category);
    setEditVisible(true);
  }

  async function saveEdit() {
    if (!selectedId) return;
    const database = await db;
    await database.runAsync(
      "UPDATE todos SET name=?, description=?, price=?, category=? WHERE id=?",
      [name, description, Number(price), category, selectedId]
    );
    setEditVisible(false);
    setSelectedId(null);
    setName("");
    setDescription("");
    setPrice("");
    setCategory("Elektronik");
    loadTodos();
  }

  // Filter & search
  const filteredTodos = todos
    .filter((t) => t.name.toLowerCase().includes(search.toLowerCase()))
    .filter((t) => {
      if (statusFilter === "completed") return t.completed === 1;
      if (statusFilter === "pending") return t.completed === 0;
      return true;
    })
    .filter((t) => {
      if (categoryFilter === "all") return true;
      return t.category === categoryFilter;
    });

  const totalPrice = filteredTodos.reduce((sum, t) => sum + t.price, 0);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Header */}
      <Appbar.Header style={{ backgroundColor: "#f3f3f3" }}>
        <Appbar.Content title="Shopping Todo" titleStyle={{ color: "#000", fontWeight: "bold" }} />
      </Appbar.Header>

      <ScrollView style={{ padding: 16 }}>
        {/* Search */}
        <TextInput
          label="Search barang"
          value={search}
          onChangeText={setSearch}
          mode="outlined"
          style={{ marginBottom: 16 }}
        />

        {/* Filter Status */}
        <Text style={{ fontWeight: "bold", marginBottom: 8 }}>Filter Status</Text>
        <SegmentedButtons
          value={statusFilter}
          onValueChange={setStatusFilter}
          buttons={[
            { value: "all", label: "Semua" },
            { value: "completed", label: "Selesai" },
            { value: "pending", label: "Belum" },
          ]}
          style={{ marginBottom: 16 }}
        />

        {/* Filter Kategori */}
        <Text style={{ fontWeight: "bold", marginBottom: 8 }}>Filter Kategori</Text>
        <SegmentedButtons
          value={categoryFilter}
          onValueChange={setCategoryFilter}
          buttons={[
            { value: "all", label: "Semua" },
            { value: "Elektronik", label: "Elektronik" },
            { value: "Makanan", label: "Makanan" },
            { value: "Fashion", label: "Fashion" },
            { value: "Lainnya", label: "Lainnya" },
          ]}
          style={{ marginBottom: 20 }}
        />

        {/* Form Add/Edit */}
        <Surface style={{ padding: 16, borderRadius: 16, elevation: 4, marginBottom: 20 }}>
          <TextInput
            label="Nama Barang"
            value={name}
            onChangeText={setName}
            mode="outlined"
            style={{ marginBottom: 10 }}
          />
          <TextInput
            label="Deskripsi"
            value={description}
            onChangeText={setDescription}
            mode="outlined"
            style={{ marginBottom: 10 }}
          />
          <TextInput
            label="Harga"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
            mode="outlined"
            style={{ marginBottom: 10 }}
          />
          <SegmentedButtons
            value={category}
            onValueChange={setCategory}
            buttons={[
              { value: "Elektronik", label: "Elektronik" },
              { value: "Makanan", label: "Makanan" },
              { value: "Fashion", label: "Fashion" },
              { value: "Lainnya", label: "Lainnya" },
            ]}
            style={{ marginBottom: 10 }}
          />
          <Button mode="contained" onPress={addTodo}>
            Tambah Barang
          </Button>
        </Surface>

        {/* Total Harga */}
        <Surface style={{ padding: 16, borderRadius: 16, elevation: 3, marginBottom: 20, backgroundColor: "#f3f3f3" }}>
          <Text style={{ fontWeight: "bold" }}>Total Harga: Rp {totalPrice}</Text>
        </Surface>

        {/* List Barang */}
        {filteredTodos.map((todo) => (
          <Surface key={todo.id} style={{ padding: 16, borderRadius: 16, elevation: 3, marginBottom: 16 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>{todo.name}</Text>
            <Text style={{ color: "gray", marginVertical: 4 }}>{todo.description}</Text>
            <Text>Harga: Rp {todo.price}</Text>
            <Text>Kategori: {todo.category}</Text>

            <Checkbox status={todo.completed ? "checked" : "unchecked"} onPress={() => toggleTodo(todo.id, todo.completed)} />

            <View style={{ flexDirection: "row" }}>
              <Button onPress={() => openEdit(todo)}>Edit</Button>
              <Button textColor="red" onPress={() => deleteTodo(todo.id)}>
                Delete
              </Button>
            </View>
          </Surface>
        ))}
      </ScrollView>

      {/* Modal Edit */}
      <Modal visible={editVisible} transparent animationType="fade">
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <Surface style={{ width: "85%", padding: 20, borderRadius: 16 }}>
            <Text style={{ fontWeight: "bold", marginBottom: 10 }}>Edit Barang</Text>
            <TextInput
              label="Nama Barang"
              value={name}
              onChangeText={setName}
              mode="outlined"
              style={{ marginBottom: 10 }}
            />
            <TextInput
              label="Deskripsi"
              value={description}
              onChangeText={setDescription}
              mode="outlined"
              style={{ marginBottom: 10 }}
            />
            <TextInput
              label="Harga"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
              mode="outlined"
              style={{ marginBottom: 10 }}
            />
            <SegmentedButtons
              value={category}
              onValueChange={setCategory}
              buttons={[
                { value: "Elektronik", label: "Elektronik" },
                { value: "Makanan", label: "Makanan" },
                { value: "Fashion", label: "Fashion" },
                { value: "Lainnya", label: "Lainnya" },
              ]}
              style={{ marginBottom: 10 }}
            />
            <Button mode="contained" onPress={saveEdit}>
              Simpan Perubahan
            </Button>
            <Button onPress={() => setEditVisible(false)}>Batal</Button>
          </Surface>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
