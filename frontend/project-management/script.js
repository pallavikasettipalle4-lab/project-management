function addProject() {
    let projectName = prompt("Enter project name:");

    if (projectName) {
        let list = document.getElementById("projectList");

        let item = document.createElement("li");

        item.textContent = projectName;

        list.appendChild(item);
    }
}