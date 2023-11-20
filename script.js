let createButton = document.getElementById("createButton");
let ticketInputElement = document.getElementById("ticketInput");
let ticketDescriptionElement = document.getElementById("ticketBody");
let todoIssuesList = document.getElementById("issues");

async function deleteIssue(Id) {
  await githubApiClient.deleteIssue(Id);
  let listId = "issue" + Id;
  let liElement = document.getElementById(listId);
  todoIssuesList.removeChild(liElement);
}

async function updateIssues(Id) {
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
    githubApiClient.updateIssue(Id, updatedTitle, updatedDescription);
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
  liElement.appendChild(ticketDescriptionName);
  let ticketDescriptionElement = document.createElement("textarea");
  ticketDescriptionElement.value = issue.body;
  ticketDescriptionElement.id = "ticketDescription" + uniqueId;
  ticketDescriptionElement.disabled = true;
  liElement.appendChild(ticketDescriptionElement);
  todoIssuesList.appendChild(liElement);
  let updateButton = document.createElement("button");
  updateButton.innerText = "Update";
  updateButton.classList.add("issues-button");
  let divContainer = document.createElement("div");
  divContainer.id = "container-" + uniqueId;
  let saveButton = document.createElement("button");
  saveButton.id = "saveBtn-" + uniqueId;
  saveButton.innerText = "Save";
  saveButton.classList.add("issues-button");
  divContainer.appendChild(saveButton);
  let cancelButton = document.createElement("button");
  cancelButton.innerText = "Cancel";
  cancelButton.id = "cancelBtn-" + uniqueId;
  cancelButton.classList.add("issues-button");
  divContainer.appendChild(cancelButton);
  divContainer.classList.add("button-container");
  liElement.appendChild(divContainer);
  updateButton.onclick = () => {
    updateIssues(issue.number);
  };
  liElement.appendChild(updateButton);
  let deleteButton = document.createElement("button");
  deleteButton.innerText = "Close";
  deleteButton.classList.add("issues-button");
  deleteButton.onclick = function () {
    deleteIssue(issue.number);
  };
  liElement.appendChild(deleteButton);
}

const githubApiClient = {
  owner: "Mahesh062001",
  repo: "CreatingApi",
  token:
    "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",
  getIssues: async function () {
    const response = await fetch(
      `https://api.github.com/repos/${this.owner}/${this.repo}/issues`
    );
    const issues = await response.json();
    return issues;
  },
  postIssues: async function (data) {
    try {
      let options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify(data),
      };
      const response = await fetch(
        `https://api.github.com/repos/${this.owner}/${this.repo}/issues`,
        options
      );
      if (!response.ok) {
        showToast(`error occured`);
      }
      const issues = await response.json();
      return issues;
    } catch (err) {
      showToast("error occured:", err);
    }
  },
  updateIssue: async function (number, updatedTitle, updatedDescription) {
    try {
      let options = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify({
          title: updatedTitle,
          body: updatedDescription,
        }),
      };

      const response = await fetch(
        `https://api.github.com/repos/${this.owner}/${this.repo}/issues/${number}`,
        options
      );
      if (!response.ok) {
        showToast(`Error: ${response.statusText}`);

        const errorData = await response.json(); // Parse the error response
        console.error("Error:", response.status, "-", response.statusText);
        console.error("Error details:", errorData);
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      } else {
        showToast(`updated issue successfully`);
      }
    } catch (err) {
      showToast("Error:", err);
    }
  },
  deleteIssue: async function (Id) {
    try {
      let options = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify({
          state: "closed",
          state_reason: "completed",
        }),
      };
      let response = await fetch(
        `https://api.github.com/repos/${this.owner}/${this.repo}/issues/${Id}`,
        options
      );
      if (!response.ok) {
        showToast(`Error`);
      } else {
        showToast(`deleted issue successfully`);
      }
    } catch (err) {
      showToast("Error:", err);
    }
  },
};
createButton.addEventListener("click", async () => {
  if (ticketInputElement.value === "") {
    showToast("Please fill out all required fields.");
    return;
  }
  let data = {
    title: ticketInputElement.value,
    body: ticketDescriptionElement.value,
  };
  const issues = await githubApiClient.postIssues(data);
  showToast("Issue created successfully!");
  createAndAppendIssue(issues);
  ticketInputElement.value = "";
  ticketDescriptionElement.value = "";
});
async function fetchingIssues() {
  const issues = await githubApiClient.getIssues();
  for (let issue of issues) {
    createAndAppendIssue(issue);
  }
}
fetchingIssues();
function showToast(message) {
  Toastify({
    text: message,
    duration: 3000,
    close: true,
    gravity: "top",
    position: "right",
    backgroundColor: "linear-gradient(to right, #bdc3c7, #2c3e50)",
  }).showToast();
}
