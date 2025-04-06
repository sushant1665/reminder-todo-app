import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export default function App() {
  const [reminders, setReminders] = useState([]);
  const [task, setTask] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Normal");
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState("");
  const [todos, setTodos] = useState([]);
  const [todoText, setTodoText] = useState("");
  const [sharedReminders, setSharedReminders] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [userAlarm, setUserAlarm] = useState("/custom-alarm.mp3");
  const alarmSoundRef = useRef(null);

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const fetchReminders = () => {
    const q = query(
      collection(db, "reminders"),
      where("sharedWith", "array-contains", user.email)
    );
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setReminders(data);
    });
    return unsub;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchReminders();
      } else {
        setUser(null);
      }
    });
    return unsubscribe;
  }, []);

  const handleAddReminder = async () => {
    if (!task || !time) return;
    const [hours, minutes] = time.split(":");
    const reminderDate = new Date(date);
    reminderDate.setHours(+hours);
    reminderDate.setMinutes(+minutes);
    reminderDate.setSeconds(0);

    const newReminder = {
      task,
      description,
      priority,
      date: reminderDate.toISOString(),
      userEmail: user.email,
      sharedWith: [user.email],
    };
    await addDoc(collection(db, "reminders"), newReminder);
    setTask("");
    setDescription("");
    setPriority("Normal");
    setTime("");

    // Optional: Google Calendar sync (conceptual - requires backend proxy or OAuth setup)
    // await fetch('/api/sync-calendar', { method: 'POST', body: JSON.stringify(newReminder) })
  };

  const updateReminder = async (id, updatedFields) => {
    await updateDoc(doc(db, "reminders", id), updatedFields);
  };

  const deleteReminder = async (id) => {
    await deleteDoc(doc(db, "reminders", id));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "text-red-500";
      case "Low":
        return "text-green-500";
      default:
        return "text-yellow-500";
    }
  };

  const filteredReminders = reminders.filter(
    (rem) =>
      rem.task.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rem.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedReminders = [...filteredReminders].sort((a, b) => {
    const priorityOrder = { High: 1, Normal: 2, Low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  if (!user) {
    return (
      <div className="p-4 max-w-sm mx-auto mt-20">
        <h1 className="text-2xl font-bold mb-4 text-center">Welcome</h1>
        <Button className="w-full" onClick={handleLogin}>
          Continue with Gmail
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        🗓️ Hello, {user.displayName || user.email}!
      </h1>
      <audio ref={alarmSoundRef} src={userAlarm} preload="auto" />

      <div className="flex items-center gap-2 mb-4">
        <label className="text-sm">🔊 Sound:</label>
        <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
      </div>

      <Tabs defaultValue="reminders" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="reminders">Reminders</TabsTrigger>
          <TabsTrigger value="todo">To-Do</TabsTrigger>
          <TabsTrigger value="shared">Shared</TabsTrigger>
        </TabsList>

        <TabsContent value="reminders">
          <div className="mb-2">
            <Input
              placeholder="Search reminders"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            {sortedReminders.map((reminder) => (
              <Card key={reminder.id} className="mb-2">
                <CardContent className="p-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <div
                        className={`font-semibold ${getPriorityColor(
                          reminder.priority
                        )}`}
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) =>
                          updateReminder(reminder.id, {
                            task: e.target.innerText,
                          })
                        }
                      >
                        {reminder.task}
                      </div>
                      <div
                        className="text-sm text-gray-500"
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) =>
                          updateReminder(reminder.id, {
                            description: e.target.innerText,
                          })
                        }
                      >
                        {reminder.description}
                      </div>
                      <div className="text-xs">
                        {new Date(reminder.date).toLocaleString()}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => deleteReminder(reminder.id)}
                    >
                      🗑️
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
