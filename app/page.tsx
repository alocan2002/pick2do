"use client";

import React, { useState, useEffect } from "react";
import { Task, Screen, Cog, Preferences } from "@/types";
import { INITIAL_TASKS, DEFAULT_PREFS } from "@/lib/constants";
import { MainScreen } from "@/components/MainScreen";
import { TaskForm } from "@/components/TaskForm";
import { SplitTaskScreen } from "@/components/SplitTaskScreen";
import { PreferencesScreen } from "@/components/PreferencesScreen";
import { OnboardingPopup } from "@/components/OnboardingPopup";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [screen, setScreen] = useState<Screen>("main");
  const [showPopup, setShowPopup] = useState(true);
  const [availableMinutes, setAvailableMinutes] = useState(30);
  const [cogState, setCogState] = useState<Cog>(null);
  
  const [tasksState, setTasksState] = useState<Task[]>(INITIAL_TASKS);
  const [prefsState, setPrefsState] = useState<Preferences>(DEFAULT_PREFS);
  
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [splitSource, setSplitSource] = useState<(Omit<Task, "id" | "done"> & { originalId?: number }) | null>(null);
  const [nextId, setNextId] = useState(1);

  useEffect(() => {
    fetch("/api/data")
      .then(res => res.json())
      .then(data => {
        setTasksState(data.tasks);
        setPrefsState(data.prefs);
        setIsLoaded(true);
      })
      .catch(err => {
        console.error("Failed to load data", err);
        setIsLoaded(true);
      });
  }, []);

  useEffect(() => {
    if (tasksState.length > 0) {
      setNextId(Math.max(...tasksState.map(t => t.id)) + 1);
    }
  }, [tasksState]);

  const saveToDisk = async (newTasks: Task[], newPrefs: Preferences) => {
    try {
      await fetch("/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasks: newTasks, prefs: newPrefs })
      });
    } catch (err) {
      console.error("Failed to save to disk", err);
    }
  };

  const setTasks = (val: Task[] | ((prev: Task[]) => Task[])) => {
    setTasksState(prev => {
      const nextTasks = typeof val === "function" ? val(prev) : val;
      saveToDisk(nextTasks, prefsState);
      return nextTasks;
    });
  };

  const setPrefs = (val: Preferences | ((prev: Preferences) => Preferences)) => {
    setPrefsState(prev => {
      const nextPrefs = typeof val === "function" ? val(prev) : val;
      saveToDisk(tasksState, nextPrefs);
      return nextPrefs;
    });
  };

  const tasks = tasksState;
  const prefs = prefsState;

  const handleDone = (minutes: number, state: Cog) => { setAvailableMinutes(minutes); setCogState(state); setShowPopup(false); };
  const handleToggleDone = (id: number) => { setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t)); setShowPopup(true); };
  const handleDelete = (id: number) => setTasks(prev => prev.filter(t => t.id !== id));
  
  const addTask = (data: Omit<Task, "id" | "done">) => { 
    if (data.duration > prefs.maxTaskDuration) {
      setSplitSource(data);
      setScreen("splitTask");
      return;
    }
    setTasks(prev => [...prev, { ...data, id: nextId, done: false }]); 
    setNextId(n => n + 1); 
    setScreen("main"); 
  };
  
  const editTask = (data: Omit<Task, "id" | "done">) => { 
    if (!editingTask) return; 
    if (data.duration > prefs.maxTaskDuration) {
      setSplitSource({ ...data, originalId: editingTask.id });
      setScreen("splitTask");
      return;
    }
    setTasks(prev => prev.map(t => t.id === editingTask.id ? { ...t, ...data } : t)); 
    setEditingTask(null); 
    setScreen("main"); 
  };
  
  const splitTaskSubmit = (parts: Omit<Task, "id" | "done">[], sequential: boolean) => {
    setTasks(prev => {
      const filtered = splitSource?.originalId ? prev.filter(t => t.id !== splitSource.originalId) : prev;
      const newTasks = parts.map((p, i) => ({
        ...p,
        id: nextId + i,
        done: false,
        dependsOn: (sequential && i > 0) ? (nextId + i - 1) : undefined
      }));
      return [...filtered, ...newTasks];
    });
    setNextId(n => n + parts.length);
    setSplitSource(null);
    if (editingTask) setEditingTask(null);
    setScreen("main");
  };

  const allSubjects = Array.from(new Set(tasks.map(t => t.subject)));

  if (!isLoaded) return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#fff", color: "#000", fontSize: 13, fontWeight: 500 }}>Loading...</div>;

  return (
    <>
      {screen === "main" && <>
        {showPopup && <OnboardingPopup onDone={handleDone} />}
        <MainScreen availableMinutes={availableMinutes} cogState={cogState} tasks={tasks} prefs={prefs}
          onAddTask={() => setScreen("addTask")} onEditTask={task => { setEditingTask(task); setScreen("editTask"); }}
          onLogoClick={() => setShowPopup(true)} onOpenPrefs={() => setScreen("preferences")}
          onOpenSplit={task => { setSplitSource({ ...task, originalId: task.id }); setScreen("splitTask"); }}
          onToggleDone={handleToggleDone} onDelete={handleDelete} />
      </>}
      {screen === "addTask" && <TaskForm initial={{}} onBack={() => setScreen("main")} onSubmit={addTask} onSplit={data => { setSplitSource(data); setScreen("splitTask"); }} submitLabel="Add task" prefs={prefs} allSubjects={allSubjects} />}
      {screen === "editTask" && editingTask && <TaskForm initial={editingTask} onBack={() => { setEditingTask(null); setScreen("main"); }} onSubmit={editTask} onSplit={data => { setSplitSource({ ...data, originalId: editingTask.id }); setScreen("splitTask"); }} submitLabel="Save changes" prefs={prefs} allSubjects={allSubjects} />}
      {screen === "splitTask" && splitSource && <SplitTaskScreen source={splitSource} onBack={() => { setSplitSource(null); setScreen("main"); }} onSubmitAll={splitTaskSubmit} prefs={prefs} />}
      {screen === "preferences" && <PreferencesScreen prefs={prefs} onSave={setPrefs} onBack={() => setScreen("main")} />}
    </>
  );
}
