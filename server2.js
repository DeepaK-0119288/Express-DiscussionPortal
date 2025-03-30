const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
let gmail;
let username;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/discuss.html", (req, res) => {
  res.sendFile(path.join(__dirname, "discuss.html"));
});

app.get("/getEmail", (req, res) => {
  if (gmail) {
    res.status(200).send(gmail);
  } else {
    res.status(404).send("Email not found");
  }
});

app.get("/getName", (req, res) => {
  if (username) {
    res.status(200).send(username);
  } else {
    res.status(404).send("Name not found");
  }
});

app.get("/getUserTasks", (req, res) => {
  const email = req.query.email;
  if (!email) {
    return res.status(400).send("Email query parameter is required");
  }
  getUserTasks(email, res);
});

app.delete("/deleteQuestion", (req, res) => {
  const { email, id } = req.body;
  if (!email || !id) {
    return res.status(400).send("Email and ID are required");
  }

  fs.readFile("signup.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }

    let users = JSON.parse(data);
    const user = users.find((user) => user.email === email);

    if (user) {
      user.tasks = user.tasks.filter((task) => task.id !== id);

      fs.writeFile("signup.json", JSON.stringify(users, null, 2), (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Internal Server Error");
        }

        res.send("Question deleted successfully");
      });
    } else {
      res.status(404).send("User not found");
    }
  });
});

app.post("/", (req, res) => {
  const { action, name, password, email } = req.body;
  if (action === "signup") {
    saveSignUpDetails(name, password, email, res);
  } else if (action === "signin") {
    verifyLoginDetails(email, password, res);
  } else if (action === "saveTasks") {
    const { email, tasks } = req.body;
    saveUserTasks(email, tasks, res);
  }
});

function saveSignUpDetails(name, password, email, res) {
  const userDetails = { name, password, email };
  fs.readFile("signup.json", "utf8", (err, data) => {
    let users = [];
    if (!err && data) {
      users = JSON.parse(data);
    }

    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
      res.status(400).send("User already exists");
      return;
    }

    users.push(userDetails);

    fs.writeFile("signup.json", JSON.stringify(users, null, 2), (err) => {
      if (err) {
        res.status(500).send("Error saving sign-up details");
      } else {
        res.send("Sign-up successful");
      }
    });
  });
}

function verifyLoginDetails(email, password, res) {
  fs.readFile("signup.json", "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Error reading user data");
      return;
    }

    const users = JSON.parse(data);

    const user = users.find(
      (user) => user.email === email && user.password === password
    );

    if (user) {
      gmail = email;
      username = user.name;
      res.redirect(`/discuss.html`);
    } else {
      res.status(401).send("Invalid Credentials !!!");
    }
  });
}

function saveUserTasks(email, tasks, res) {
  fs.readFile("signup.json", "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Error reading user data");
      return;
    }

    let users = JSON.parse(data);
    const userIndex = users.findIndex((user) => user.email === email);
    if (userIndex !== -1) {
      users[userIndex].tasks = tasks;
      fs.writeFile("signup.json", JSON.stringify(users, null, 2), (err) => {
        if (err) {
          res.status(500).send("Error saving tasks");
        } else {
          res.send("Tasks saved successfully");
        }
      });
    } else {
      res.status(404).send("User not found");
    }
  });
}

function getUserTasks(email, res) {
  fs.readFile("signup.json", "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Error reading user data");
      return;
    }

    const users = JSON.parse(data);
    const user = users.find((user) => user.email === email);
  
    if (user) {
      res.json({ tasks: user.tasks || [] });
    } else {
      res.status(404).send("User not found");
    }
  });
}

const port = 4700;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
