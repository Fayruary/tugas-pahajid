import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { View, ScrollView, Text, Modal } from "react-native";
import { Button, Checkbox, Surface, TextInput, Appbar, List } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

type Todo = {
    id: string;
    title: string;
    completed: Boolean;
};

export default function TodoPage() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const [editVisible, setEditVisible] = useState(false);
    const [editText, setEditText] = useState("");
    const [selectedId, setSelectedId] = useState<string | null>(null);

    async function loadTodo() {
        const storedTodos = await AsyncStorage.getItem("todos");
        if (storedTodos) {
            setTodos(JSON.parse(storedTodos));
        }
        setLoading(false);
    }

    useEffect(() => {
        loadTodo();
    }, []);

    async function addTodo() {
        if (!input.trim()) return;
        const newTodo: Todo = {
            id: Math.random().toString(),
            title: input,
            completed: false,
        };
        const updatedTodos = [newTodo, ...todos];
        setTodos(updatedTodos);
        setInput("");
        await AsyncStorage.setItem("todos", JSON.stringify(updatedTodos));
    }

    async function deleteTodo(id: string) {
        const updatedTodos = todos.filter((todo) => todo.id !== id);
        setTodos(updatedTodos);
        await AsyncStorage.setItem("todos", JSON.stringify(updatedTodos));
    }

    async function toggleTodo(id: string) {
        const updatedTodos = todos.map((todo) => 
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
        setTodos(updatedTodos);
        await AsyncStorage.setItem("todos", JSON.stringify(updatedTodos));
    }

    function openEdit(todo: Todo) {
        setSelectedId(todo.id);
        setEditText(todo.title);
        setEditVisible(true);
    }

    async function saveEdit() {
        if (!selectedId) return;
        const updatedTodos = todos.map(todo =>
            todo.id === selectedId ? { ...todo, title: editText } : todo
        );
        setTodos(updatedTodos);
        await AsyncStorage.setItem("todos", JSON.stringify(updatedTodos));
        setEditVisible(false);
        setSelectedId(null);
        setEditText("");
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => {}} />
                <Appbar.Content title="Todo" />
            </Appbar.Header>

            <View style={{ padding: 16, flex: 1 }}>
                <Surface style={{ padding:16, borderRadius:12, elevation:4 }}>
                    <TextInput
                        label="New Todo"
                        onChangeText={setInput}
                        value={input}
                        mode="outlined"
                        right={<TextInput.Icon icon="plus" onPress={addTodo} />}
                    />   
                </Surface>

                <ScrollView style={{ marginTop:16 }}>
                    {todos.map((todo) => (
                        <Surface
                            key={todo.id}
                            style={{ marginBottom:12, borderRadius:8, elevation:2 }}
                        >
                            <List.Item
                                title={() => <Text>{todo.title}</Text>}
                                left={() => (
                                    <Checkbox
                                        status={todo.completed ? "checked" : "unchecked"}
                                        onPress={() => toggleTodo(todo.id)}
                                    />
                                )}
                                right={() => (
                                    <View style={{ flexDirection: "row" }}>
                                        <Button onPress={() => openEdit(todo)}>Edit</Button>
                                        <Button onPress={() => deleteTodo(todo.id)}>Delete</Button>
                                    </View>
                                )}
                            />
                        </Surface>
                    ))}
                </ScrollView>
            </View>

          
            <Modal
                visible={editVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setEditVisible(false)}
            >
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "rgba(0,0,0,0.5)"
                    }}
                >
                    <View
                        style={{
                            width: "80%",
                            padding: 20,
                            backgroundColor: "white",
                            borderRadius: 8
                        }}
                    >
                        <TextInput
                            label="Todo title"
                            value={editText}
                            onChangeText={setEditText}
                            mode="outlined"
                        />
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 }}>
                            <Button onPress={() => setEditVisible(false)}>Cancel</Button>
                            <Button onPress={saveEdit}>Save</Button>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}
