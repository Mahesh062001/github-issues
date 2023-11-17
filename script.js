const owner = "Mahesh062001";
const repo = "CreatingApi";
const token =
  "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";

let createButton = document.getElementById("createButton");
let ticketInputElement = document.getElementById("ticketInput");
let ticketDescriptionElement = document.getElementById("ticketBody");
let todoIssuesList = document.getElementById("issues");

async function deleteIssue(Id) {
  let options = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      state: "closed",
      state_reason: "completed",
    }),
  };
  await fetch(
    `https://api.github.com/repos/${owner}/${repo}/issues/${Id}`,
    options
  );
  let listId = "issue" + Id;
  let liElement = document.getElementById(listId);
  todoIssuesList.removeChild(liElement);
}

async function updateIssue(Id) {
  let uniqueTicketId = "ticketTitle" + Id;
  let ticketTitle = document.getElementById(uniqueTicketId);
  let uniqueDescriptionId = "ticketDescription" + Id;
  let ticketDescription = document.getElementById(uniqueDescriptionId);
  let containerId = "container-" + Id;
  let divContainer = document.getElementById(containerId);
  let saveBtnId = "saveBtn-" + Id;
  let cancelBtnId = "cancelBtn-" + Id;
  let saveBtn = document.getElementById(saveBtnId);
  let cancelBtn = document.getElementById(cancelBtnId);
  ticketTitle.disabled = false;
  ticketDescription.disabled = false;
  divContainer.style.display = "block";
  saveBtn.onclick = function () {
    let updatedTitle = ticketTitle.value;
    let updatedDescription = ticketDescription.value;
    updateGitHubIssue(Id, updatedTitle, updatedDescription);
    divContainer.style.display = "none";
    ticketTitle.disabled = true;
    ticketDescription.disabled = true;
  };
  cancelBtn.onclick = function () {
    divContainer.style.display = "none";
    ticketTitle.disabled = true;
    ticketDescription.disabled = true;
  };
}
async function updateGitHubIssue(number, updatedTitle, updatedDescription) {
  let options = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: updatedTitle,
      body: updatedDescription,
    }),
  };

  await fetch(
    `https://api.github.com/repos/${owner}/${repo}/issues/${number}`,
    options
  );
}

function createAndAppendIssue(issue) {
  let liElement = document.createElement("li");
  let uniqueId = issue.number;
  liElement.id = "issue" + uniqueId;
  let ticketTitleName = document.createElement("h2");
  ticketTitleName.innerText = "Title";
  liElement.appendChild(ticketTitleName);
  let ticketTitleElement = document.createElement("input");
  ticketTitleElement.type = "text";
  ticketTitleElement.value = issue.title;
  ticketTitleElement.disabled = true;
  ticketTitleElement.id = "ticketTitle" + uniqueId;
  liElement.appendChild(ticketTitleElement);
  let ticketDescriptionName = document.createElement("h2");
  ticketDescriptionName.innerText = "Description";
  ticketDescriptionName.setAttribute("for", "ticketTitle" + uniqueId);
  liElement.appendChild(ticketDescriptionName);
  let ticketDescriptionElement = document.createElement("textarea");
  ticketDescriptionElement.value = issue.body;
  ticketDescriptionElement.id = "ticketDescription" + uniqueId;
  ticketDescriptionElement.disabled = true;
  liElement.appendChild(ticketDescriptionElement);
  todoIssuesList.appendChild(liElement);
  let updateButton = document.createElement("button");
  updateButton.innerText = "update";
  updateButton.style.color = "#ffffff";
  updateButton.style.backgroundColor = "slategrey";
  let divContainer = document.createElement("div");
  divContainer.id = "container-" + uniqueId;
  let saveButton = document.createElement("button");
  saveButton.id = "saveBtn-" + uniqueId;
  saveButton.innerText = "save";
  saveButton.style.color = "#ffffff";
  saveButton.style.backgroundColor = "slategrey";
  divContainer.appendChild(saveButton);
  let cancelButton = document.createElement("button");
  cancelButton.innerText = "cancel";
  cancelButton.style.color = "#ffffff";
  cancelButton.style.backgroundColor = "slategrey";
  cancelButton.id = "cancelBtn-" + uniqueId;
  divContainer.appendChild(cancelButton);
  divContainer.classList.add("div-container");
  liElement.appendChild(divContainer);
  updateButton.onclick = () => {
    updateIssue(issue.number);
  };
  liElement.appendChild(updateButton);
  let deleteButton = document.createElement("button");
  deleteButton.innerText = "delete";
  deleteButton.style.color = "#ffffff";
  deleteButton.style.backgroundColor = "slategrey";
  deleteButton.onclick = function () {
    deleteIssue(issue.number);
  };
  liElement.appendChild(deleteButton);
}

createButton.addEventListener("click", async () => {
  if (ticketInputElement.value === "") {
    alert("Title is required");
    return;
  }
  let data = {
    title: ticketInputElement.value,
    body: ticketDescriptionElement.value,
  };

  let options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  };

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/issues`,
    options
  );
  const issues = await response.json();
  createAndAppendIssue(issues);
  ticketInputElement.value = "";
  ticketDescriptionElement.value = "";
});

async function fetchingIssues() {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/issues`
  );
  const issues = await response.json();
  for (let issue of issues) {
    createAndAppendIssue(issue);
  }
}
fetchingIssues();
