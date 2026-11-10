let editor;
let pyodide;
let currentFile = "main.py";
let files = {};

const examples = {
  hello: `# Hello World
print("Hello from PyCode!")
print("You're coding Python on your iPhone!")`,
  
  math: `# Math Fun
import math

print("Pi is approximately:", math.pi)
print("Square root of 16:", math.sqrt(16))

for i in range(1, 6):
    print(f"{i} squared is {i**2}")`,
  
  loop: `# Loop Example
numbers = [1, 2, 3, 4, 5]
total = 0

for num in numbers:
    total += num
    print(f"Added {num}, total is now {total}")

print("Final total:", total)`,
  
  function: `# Function Example
def greet(name):
    return f"Hello, {name}! Welcome to PyCode."

print(greet("Coder"))
print(greet("Python"))

def add(a, b):
    return a + b

print("5 + 3 =", add(5, 3))`
};

async function initPyodide() {
  const status = document.getElementById("console-output");
  status.textContent = "Loading Python (Pyodide)... This may take a moment on first launch.\n";
  
  try {
    pyodide = await loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/"
    });
    
    // Redirect stdout
    pyodide.setStdout({
      batched: (msg) => {
        appendConsole(msg);
      }
    });
    pyodide.setStderr({
      batched: (msg) => {
        appendConsole("Error: " + msg);
      }
    });
    
    status.textContent = "Python ready! Write some code and hit Run.\n";
  } catch (err) {
    status.textContent = "Failed to load Python: " + err.message + "\nCheck your internet connection.";
  }
}

function appendConsole(text) {
  const consoleEl = document.getElementById("console-output");
  consoleEl.textContent += text + "\n";
  consoleEl.scrollTop = consoleEl.scrollHeight;
}

function loadFiles() {
  const saved = localStorage.getItem("pycode-files");
  if (saved) {
    files = JSON.parse(saved);
  } else {
    files = { "main.py": examples.hello };
  }
  if (!files[currentFile]) {
    files[currentFile] = examples.hello;
  }
  editor.setValue(files[currentFile], -1);
  updateFileList();
}

function saveCurrentFile() {
  files[currentFile] = editor.getValue();
  localStorage.setItem("pycode-files", JSON.stringify(files));
}

function updateFileList() {
  const list = document.getElementById("file-list");
  list.innerHTML = "";
  
  Object.keys(files).forEach(name => {
    const item = document.createElement("div");
    item.className = "file-item";
    item.innerHTML = `
      <span>${name}</span>
      <button class="delete-btn" data-file="${name}">✕</button>
    `;
    item.querySelector("span").onclick = () => loadFile(name);
    item.querySelector(".delete-btn").onclick = (e) => {
      e.stopPropagation();
      deleteFile(name);
    };
    list.appendChild(item);
  });
}

function loadFile(name) {
  saveCurrentFile();
  currentFile = name;
  editor.setValue(files[name] || "", -1);
  document.getElementById("file-modal").classList.remove("active");
}

function deleteFile(name) {
  if (Object.keys(files).length <= 1) {
    alert("You need at least one file!");
    return;
  }
  if (confirm(`Delete ${name}?`)) {
    delete files[name];
    if (currentFile === name) {
      currentFile = Object.keys(files)[0];
      editor.setValue(files[currentFile], -1);
    }
    localStorage.setItem("pycode-files", JSON.stringify(files));
    updateFileList();
  }
}

async function runCode() {
  if (!pyodide) {
    appendConsole("Python is still loading...");
    return;
  }
  
  const code = editor.getValue();
  saveCurrentFile();
  
  const consoleEl = document.getElementById("console-output");
  consoleEl.textContent = ""; // Clear previous output
  
  try {
    await pyodide.runPythonAsync(code);
  } catch (err) {
    appendConsole(err.message);
  }
}

// Initialize Ace Editor
window.onload = function() {
  editor = ace.edit("editor");
  editor.setTheme("ace/theme/monokai");
  editor.session.setMode("ace/mode/python");
  editor.setOptions({
    fontSize: "15px",
    showPrintMargin: false,
    wrap: true,
    enableBasicAutocompletion: true,
    enableLiveAutocompletion: true
  });
  
  // Mobile-friendly
  editor.container.style.lineHeight = "1.5";
  
  loadFiles();
  initPyodide();
  
  // Event listeners
  document.getElementById("run-btn").onclick = runCode;
  document.getElementById("save-btn").onclick = () => {
    saveCurrentFile();
    appendConsole("Saved " + currentFile);
  };
  
  document.getElementById("clear-console").onclick = () => {
    document.getElementById("console-output").textContent = "";
  };
  
  document.getElementById("files-btn").onclick = () => {
    updateFileList();
    document.getElementById("file-modal").classList.add("active");
  };
  
  document.getElementById("close-modal").onclick = () => {
    document.getElementById("file-modal").classList.remove("active");
  };
  
  document.getElementById("new-file-btn").onclick = () => {
    const name = document.getElementById("new-filename").value.trim() || "untitled.py";
    if (!name.endsWith(".py")) name += ".py";
    if (files[name]) {
      alert("File already exists!");
      return;
    }
    files[name] = "# New file\nprint('Hello!')";
    localStorage.setItem("pycode-files", JSON.stringify(files));
    loadFile(name);
    document.getElementById("new-filename").value = "";
  };
  
  document.getElementById("examples").onchange = function() {
    const key = this.value;
    if (key && examples[key]) {
      editor.setValue(examples[key], -1);
      this.value = "";
    }
  };
  
  // Auto-save on change (debounced)
  let saveTimeout;
  editor.session.on("change", () => {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(saveCurrentFile, 1000);
  });
};
