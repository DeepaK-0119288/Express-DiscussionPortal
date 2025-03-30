// localStorage.clear();

let btn1 = document.querySelector("#b1");
let rightDiv = document.querySelector(".right-div");
let leftDiv = document.querySelector(".left-div");
let searchInput = document.querySelector("#search");

let questionsContainer = document.createElement("div");
questionsContainer.className = "questions-container";
leftDiv.appendChild(questionsContainer);

let gmail;
let uname;
let array = [];

document.addEventListener("DOMContentLoaded", () => {
  fetch("/getName")
    .then((response) => {
      if (response.ok) {
        return response.text();
      } else {
        throw new Error("Name not found");
      }
    })
    .then((username) => {
      console.log(username);
      uname = username;
      document.getElementById("u-name").innerText = `{ UserName: ${uname} }`; 
    })
    .catch((error) => {
      console.error("Error fetching name:", error);
    });

  fetch("/getEmail")
    .then((response) => {
      if (response.ok) {
        return response.text();
      } else {
        throw new Error("Email not found");
      }
    })
    .then((email) => {
      console.log(email);
      gmail = email;
      return fetch(`/getUserTasks?email=${encodeURIComponent(email)}`);
    })

    .then((response) => {
      if (!response.ok) {
        throw new Error("Error fetching user tasks");
      }
      return response.json();
    })
    .then((data) => {
      if (data.tasks) {
        array.push(...data.tasks);
        loadQuestions(searchInput.value.toLowerCase());
        console.log(array);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

searchInput.addEventListener("input", () => {
  loadQuestions(searchInput.value.toLowerCase());
});

function loadQuestions(searchQuery = "") {
  questionsContainer.innerHTML = "";

  array
    .filter(
      ({ subject, question }) =>
        subject.toLowerCase().includes(searchQuery) ||
        question.toLowerCase().includes(searchQuery)
    )
    .sort((a, b) => b.favorite - a.favorite)
    .forEach(({ subject, question, favorite, timeAdded, id, name }) => {
      addQuestionToDOM(subject, question, favorite, timeAdded, id, name);
    });
}

function addResponse(subject, name, answer, div4) {
  let questionObj = array.find((obj) => obj.subject === subject);

  if (questionObj) {
    let response = { name, answer, likes: 0, dislikes: 0 };
    questionObj.responses.push(response);
    // localStorage.setItem("array", JSON.stringify(array));

    saveQuestions();

    renderResponses(questionObj.responses, div4);
  }
}

function renderResponses(responses, div4) {
  div4.innerHTML = "";

  responses.sort((a, b) => b.likes - a.likes);

  responses.forEach((response) => {
    let div5 = document.createElement("div");
    let para_div = document.createElement("div");
    let r_para3 = document.createElement("p");
    let r_para4 = document.createElement("p");
    let btn_span = document.createElement("div");
    let likeButton = document.createElement("button");
    let dislikeButton = document.createElement("button");

    div5.className = "div5";
    para_div.className = "div6";
    r_para3.className = "para2";
    r_para4.className = "para3";
    btn_span.id = "btn-span";
    likeButton.className = "like-btn";
    dislikeButton.className = "dislike-btn";

    r_para3.innerText = response.name;
    r_para4.innerText = response.answer;
    likeButton.innerText = `👍🏻 ${response.likes}`;
    dislikeButton.innerText = `👎🏻 ${response.dislikes}`;

    div4.appendChild(div5);
    div5.appendChild(para_div);
    para_div.appendChild(r_para3);
    para_div.appendChild(r_para4);
    div5.appendChild(btn_span);
    btn_span.appendChild(likeButton);
    btn_span.appendChild(dislikeButton);

    likeButton.addEventListener("click", () => {
      response.likes += 1;
      // localStorage.setItem("array", JSON.stringify(array));
      saveQuestions();
      renderResponses(responses, div4);
    });

    dislikeButton.addEventListener("click", () => {
      response.dislikes += 1;
      // localStorage.setItem("array", JSON.stringify(array));
      saveQuestions();
      renderResponses(responses, div4);
    });
  });

  div4.style.overflow = "auto";
}

function responseSection(subject, question, id) {
  let r_newdiv = document.createElement("div");
  r_newdiv.className = "r_newDiv";
  rightDiv.appendChild(r_newdiv);

  let div1 = document.createElement("div");
  let div2 = document.createElement("div");
  let r_question = document.createElement("h2");
  let r_para1 = document.createElement("p");
  let r_para2 = document.createElement("p");
  let r_resolve = document.createElement("button");

  div1.className = "div1";
  div2.className = "div2";
  r_question.id = "ques";
  r_para1.className = "para1";
  r_para2.className = "para1";
  r_resolve.id = "resolve1";

  r_question.innerText = "Question";
  r_para1.innerText = subject;
  r_para2.innerText = question;
  r_resolve.innerText = "Resolve";

  r_newdiv.appendChild(div1);
  div1.appendChild(r_question);
  div1.appendChild(div2);
  div2.appendChild(r_para1);
  div2.appendChild(r_para2);
  div1.appendChild(r_resolve);

  let div3 = document.createElement("div");
  let div4 = document.createElement("div");
  let r_response = document.createElement("h2");

  div3.classList = "div3";
  div4.className = "div4";
  r_response.id = "r_response";

  r_response.innerText = "Response";

  r_newdiv.appendChild(div3);
  div3.appendChild(r_response);
  div3.appendChild(div4);

  let questionObj = array.find((obj) => obj.subject === subject);
  if (questionObj && questionObj.responses.length > 0) {
    div3.style.display = "block";
    renderResponses(questionObj.responses, div4);
  } else {
    div3.style.display = "none";
  }

  let div6 = document.createElement("div");
  let r_addResponse = document.createElement("h2");
  let r_input = document.createElement("input");
  let r_txtxArea = document.createElement("textarea");
  let r_submit = document.createElement("button");

  div6.className = "div6";
  r_addResponse.id = "addRes";
  r_input.id = "input2";
  r_txtxArea.id = "txtArea2";
  r_submit.id = "submit2";

  r_addResponse.innerText = "Add Response";
  r_input.placeholder = "Enter Name...";
  r_txtxArea.placeholder = "Enter Answer...";
  r_submit.innerText = "Submit";

  r_newdiv.appendChild(div6);
  div6.appendChild(r_addResponse);
  div6.appendChild(r_input);
  div6.appendChild(r_txtxArea);
  div6.appendChild(r_submit);

  r_submit.addEventListener("click", function () {
    const t_name = r_input.value.trim();
    const t_ans = r_txtxArea.value.trim();
    if (t_name != "" && t_ans != "") {
      div3.style.display = "block";
      addResponse(subject, t_name, t_ans, div4);
      r_input.value = "";
      r_txtxArea.value = "";
    } else {
      alert("Please Enter Your Name and Answer !!!!!");
    }
  });

  r_resolve.addEventListener("click", function () {
    array = array.filter((obj) => obj.id !== id);
    // localStorage.setItem("array", JSON.stringify(array));
    loadQuestions(searchInput.value.toLowerCase());
    rightDiv.innerHTML = "";

    fetch("/deleteQuestion", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: gmail, id: id }),
    })
      .then((response) => response.text())
      .then((text) => console.log(text))
      .catch((error) => console.error("Error:", error));
  });
}

function clickOnDiv(subject, question, id) {
  rightDiv.innerHTML = "";
  responseSection(subject, question, id);
}

function addQuestionToDOM(subject, question, favorite = false, timeAdded, id, u_name) {
  let s_leftdiv = document.createElement("div");
  let l_div = document.createElement("div");
  let d1 = document.createElement("div");
  let d2 = document.createElement("div");
  let star_btn = document.createElement("span");
  let timeDisplay = document.createElement("p");
  let n_para = document.createElement("p");
  let l_head1 = document.createElement("h2");
  let l_para1 = document.createElement("p");

  s_leftdiv.className = "s-leftdiv";
  l_div.className = "l_div1";
  d1.className = "d1";
  d2.className = "d2";
  star_btn.id = "star-btn";
  timeDisplay.className = "time-display";
  n_para.id = "n-para";
  l_head1.id = "head1";
  l_para1.id = "para1";

  star_btn.innerText = favorite ? "⭐" : "☆";
  l_head1.innerText = subject;
  l_para1.innerText = question;
  if (timeAdded) {
    timeDisplay.innerText = formatTimeSince(timeAdded);
  }
  n_para.innerText = "Created By:"+u_name;

  questionsContainer.appendChild(s_leftdiv);
  s_leftdiv.appendChild(l_div);
  l_div.appendChild(d1);
  d1.appendChild(l_head1);
  d1.appendChild(l_para1);
  l_div.appendChild(d2);
  d2.appendChild(star_btn);
  d2.appendChild(timeDisplay);
  d2.appendChild(n_para);

  setInterval(() => {
    timeDisplay.innerText = formatTimeSince(timeAdded);
  }, 1000);

  l_div.addEventListener("click", () => clickOnDiv(subject, question, id));

  star_btn.addEventListener("click", (event) => {
    event.stopPropagation();
    favorite = !favorite;
    const questionObj = array.find((obj) => obj.id === id);
    if (questionObj) {
      questionObj.favorite = favorite;
      // localStorage.setItem("array", JSON.stringify(array));
      loadQuestions(searchInput.value.toLowerCase());
    }
  });
}

function addQuestions(subject, question, favorite = false) {
  const lastId = array.length ? array[array.length - 1].id : 0;
  const newId = lastId + 1;

  let newQuestion = {
    id: newId,
    subject: subject,
    question: question,
    favorite: favorite,
    timeAdded: Date.now(),
    name: uname,
    responses: [],
  };

  array.push(newQuestion);
  // localStorage.setItem("array", JSON.stringify(array));

  saveQuestions();

  addQuestionToDOM(
    newQuestion.subject,
    newQuestion.question,
    newQuestion.favorite,
    newQuestion.timeAdded,
    newQuestion.id,
    newQuestion.name
  );
}

function formatTimeSince(timestamp) {
  const now = Date.now();
  const seconds = Math.floor((now - timestamp) / 1000);

  if (seconds < 60) return `${seconds} sec ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

function addQuestionForm() {
  rightDiv.innerHTML = "";

  let q_formDiv = document.createElement("div");
  let w_txt = document.createElement("h1");
  let p_txt = document.createElement("p");
  let q_input = document.createElement("input");
  let q_txtxArea = document.createElement("textarea");
  let q_submit = document.createElement("button");

  q_formDiv.className = "Div";
  w_txt.id = "wlcm";
  p_txt.id = "r_para1";
  q_input.id = "input1";
  q_txtxArea.id = "txtArea1";
  q_submit.id = "submit1";

  w_txt.innerText = "Welcome to Discussion Portal";
  p_txt.innerText = "Enter a subject and question to get started...";
  q_input.placeholder = "Enter Subject";
  q_txtxArea.placeholder = "Enter Question";
  q_submit.innerText = "Submit";

  rightDiv.appendChild(q_formDiv);
  q_formDiv.appendChild(w_txt);
  q_formDiv.appendChild(p_txt);
  q_formDiv.appendChild(q_input);
  q_formDiv.appendChild(q_txtxArea);
  q_formDiv.appendChild(q_submit);

  q_submit.addEventListener("click", function () {
    const trimmedSubject = q_input.value.trim();
    const trimmedQuestion = q_txtxArea.value.trim();

    if (trimmedSubject !== "" && trimmedQuestion !== "") {
      rightDiv.innerHTML = "";
      addQuestions(trimmedSubject, trimmedQuestion);
      q_input.value = "";
      q_txtxArea.value = "";
    } else {
      alert("Subject and Question fields cannot be empty or just spaces");
    }
  });
}

btn1.addEventListener("click", function () {
  addQuestionForm();
});

// New Startp

function saveQuestions() {
  fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "saveTasks",
      email: gmail,
      tasks: array,
    }),
  })
    .then((response) => response.text())
    .then((text) => console.log("Save response:", text))
    .catch((error) => console.error("Error:", error));
}  