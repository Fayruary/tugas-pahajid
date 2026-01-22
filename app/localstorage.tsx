import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TextInput, View, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LocalStorage() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [kelas, setKelas] = useState("");
  const [jurusan, setJurusan] = useState("");

  async function saveData() {
    const data = { name, age, kelas, jurusan };
    await AsyncStorage.setItem("userData", JSON.stringify(data));
  }

  async function deleteData() {
    await AsyncStorage.removeItem("userData");
    setName("");
    setAge("");
    setKelas("");
    setJurusan("");
  }

  async function getData() {
    const storedData = await AsyncStorage.getItem("userData");
    if (storedData) {
      const parsed = JSON.parse(storedData);
      setName(parsed.name);
      setAge(parsed.age);
      setKelas(parsed.kelas);
      setJurusan(parsed.jurusan);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#f4f6f8",
        padding: 16,
      }}
    >
      <Text
        style={{
          fontSize: 22,
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: 20,
          color: "#000",
        }}
      >
        Data Siswa
      </Text>

      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 12,
          padding: 16,
          marginBottom: 20,
          elevation: 3,
        }}
      >
        <Text style={{ color: "#555" }}>Nama</Text>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: "#ddd",
            borderRadius: 8,
            padding: 10,
            marginBottom: 12,
            color: "#000",
            backgroundColor: "#fff",
          }}
          placeholder="Masukkan Nama"
          value={name}
          onChangeText={setName}
        />

        <Text style={{ color: "#555" }}>Umur</Text>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: "#ddd",
            borderRadius: 8,
            padding: 10,
            marginBottom: 12,
            color: "#000",
            backgroundColor: "#fff",
          }}
          placeholder="Masukkan Umur"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
        />

        <Text style={{ color: "#555" }}>Kelas</Text>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: "#ddd",
            borderRadius: 8,
            padding: 10,
            marginBottom: 12,
            color: "#000",
            backgroundColor: "#fff",
          }}
          placeholder="Masukkan Kelas"
          value={kelas}
          onChangeText={setKelas}
        />

        <Text style={{ color: "#555" }}>Jurusan</Text>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: "#ddd",
            borderRadius: 8,
            padding: 10,
            marginBottom: 12,
            color: "#000",
            backgroundColor: "#fff",
          }}
          placeholder="Masukkan Jurusan"
          value={jurusan}
          onChangeText={setJurusan}
        />
      </View>

      {/* BUTTON */}
      <View style={{ gap: 10 }}>
        <TouchableOpacity
          style={{
            backgroundColor: "#000",
            padding: 14,
            borderRadius: 8,
            alignItems: "center",
          }}
          onPress={saveData}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>
            Simpan Data
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: "#000",
            padding: 14,
            borderRadius: 8,
            alignItems: "center",
          }}
          onPress={getData}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>
            Ambil Data
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: "#ff4d4d",
            padding: 14,
            borderRadius: 8,
            alignItems: "center",
          }}
          onPress={deleteData}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>
            Hapus Data
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
