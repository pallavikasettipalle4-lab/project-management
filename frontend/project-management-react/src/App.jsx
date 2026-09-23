import { useEffect, useState } from "react";

function App() {
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [editingProjectId, setEditingProjectId] = useState(null);

  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    status: "Active",
    startDate: "",
    endDate: "",
    assignedEmployees: [],
  });

  // Load projects, employees and tasks
  const loadData = async () => {
    try {
      const projectResponse = await fetch("/api/projects");
      const employeeResponse = await fetch("/api/employees");
      const taskResponse = await fetch("/api/tasks");

      const projectData = await projectResponse.json();
      const employeeData = await employeeResponse.json();
      const taskData = await taskResponse.json();

      setProjects(projectData);
      setEmployees(employeeData);
      setTasks(taskData);
    } catch (error) {
      console.log("Error loading data:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Select or remove employee
  const toggleEmployee = (employeeId) => {
    setNewProject((previousProject) => {
      const alreadySelected =
        previousProject.assignedEmployees.includes(employeeId);

      if (alreadySelected) {
        return {
          ...previousProject,
          assignedEmployees: previousProject.assignedEmployees.filter(
            (id) => id !== employeeId
          ),
        };
      }

      return {
        ...previousProject,
        assignedEmployees: [
          ...previousProject.assignedEmployees,
          employeeId,
        ],
      };
    });
  };

  // Reset project form
  const resetProjectForm = () => {
    setEditingProjectId(null);

    setNewProject({
      name: "",
      description: "",
      status: "Active",
      startDate: "",
      endDate: "",
      assignedEmployees: [],
    });
  };

  // Create project
  const addProject = async () => {
    if (
      !newProject.name ||
      !newProject.description ||
      !newProject.startDate ||
      !newProject.endDate
    ) {
      alert("Please fill all project fields");
      return;
    }

    if (newProject.endDate < newProject.startDate) {
      alert("End date cannot be before start date");
      return;
    }

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProject),
      });

      if (!response.ok) {
        throw new Error("Failed to create project");
      }

      resetProjectForm();
      loadData();
    } catch (error) {
      console.log("Add project error:", error);
      alert("Could not create project");
    }
  };

  // Start editing
  const startEditProject = (project) => {
    setEditingProjectId(project._id);

    setNewProject({
      name: project.name || "",
      description: project.description || "",
      status: project.status || "Active",
      startDate: project.startDate
        ? project.startDate.split("T")[0]
        : "",
      endDate: project.endDate
        ? project.endDate.split("T")[0]
        : "",
      assignedEmployees: project.assignedEmployees || [],
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Update project
  const updateProject = async () => {
    if (
      !newProject.name ||
      !newProject.description ||
      !newProject.startDate ||
      !newProject.endDate
    ) {
      alert("Please fill all project fields");
      return;
    }

    if (newProject.endDate < newProject.startDate) {
      alert("End date cannot be before start date");
      return;
    }

    try {
      const response = await fetch(
        "/api/projects/" + editingProjectId,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newProject),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update project");
      }

      resetProjectForm();
      loadData();
    } catch (error) {
      console.log("Update project error:", error);
      alert("Could not update project");
    }
  };

  // Delete project
  const deleteProject = async (projectId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        "/api/projects/" + projectId,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete project");
      }

      loadData();
    } catch (error) {
      console.log("Delete project error:", error);
      alert("Could not delete project");
    }
  };

  // Calculate project progress
  const getProjectProgress = (projectId) => {
    const projectTasks = tasks.filter(
      (task) => task.projectId?._id === projectId
    );

    if (projectTasks.length === 0) {
      return {
        total: 0,
        completed: 0,
        percentage: 0,
      };
    }

    const completedTasks = projectTasks.filter(
      (task) => task.status === "Completed"
    );

    const percentage = Math.round(
      (completedTasks.length / projectTasks.length) * 100
    );

    return {
      total: projectTasks.length,
      completed: completedTasks.length,
      percentage: percentage,
    };
  };

  // Summary counts
  const activeProjects = projects.filter(
    (project) => project.status === "Active"
  ).length;

  const completedProjects = projects.filter(
    (project) => project.status === "Completed"
  ).length;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">

      {/* Navbar */}
      <nav className="bg-slate-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">

          <div>
            <h1 className="text-2xl font-bold">
              Project Management System
            </h1>

            <p className="text-slate-400 text-sm mt-1">
              Manage and track projects efficiently
            </p>
          </div>

          <div className="hidden md:block bg-purple-600 px-4 py-2 rounded-full text-sm font-semibold">
            Project Management
          </div>

        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">

        {/* Heading */}
        <div className="mb-8">

          <p className="text-purple-600 font-semibold text-sm uppercase tracking-wide">
            Dashboard
          </p>

          <h2 className="text-4xl font-bold text-slate-900 mt-1">
            Project Overview
          </h2>

          <p className="text-slate-500 mt-2">
            Create, manage and monitor your projects from one place.
          </p>

        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">

          {/* Total */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition">

            <div className="flex justify-between items-center">

              <div>
                <p className="text-slate-500 text-sm">
                  Total Projects
                </p>

                <p className="text-4xl font-bold text-purple-600 mt-2">
                  {projects.length}
                </p>
              </div>

              <div className="bg-purple-100 text-purple-600 w-12 h-12 rounded-xl flex items-center justify-center text-2xl">
                📁
              </div>

            </div>

          </div>

          {/* Active */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition">

            <div className="flex justify-between items-center">

              <div>
                <p className="text-slate-500 text-sm">
                  Active Projects
                </p>

                <p className="text-4xl font-bold text-blue-600 mt-2">
                  {activeProjects}
                </p>
              </div>

              <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-xl flex items-center justify-center text-2xl">
                🚀
              </div>

            </div>

          </div>

          {/* Completed */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition">

            <div className="flex justify-between items-center">

              <div>
                <p className="text-slate-500 text-sm">
                  Completed Projects
                </p>

                <p className="text-4xl font-bold text-green-600 mt-2">
                  {completedProjects}
                </p>
              </div>

              <div className="bg-green-100 text-green-600 w-12 h-12 rounded-xl flex items-center justify-center text-2xl">
                ✓
              </div>

            </div>

          </div>

        </div>

        {/* Create / Edit Project */}
        <section className="mb-12">

          <div className="flex items-center gap-3 mb-5">

            <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center text-xl">
              {editingProjectId ? "✏️" : "+"}
            </div>

            <div>

              <h2 className="text-2xl font-bold text-slate-900">
                {editingProjectId
                  ? "Edit Project"
                  : "Create New Project"}
              </h2>

              <p className="text-slate-500 text-sm">
                {editingProjectId
                  ? "Update project information"
                  : "Add a new project to your system"}
              </p>

            </div>

          </div>

          <div className="bg-white rounded-2xl p-7 shadow-sm border border-slate-200">

            <div className="grid md:grid-cols-2 gap-6">

              {/* Project Name */}
              <div>

                <label className="block text-sm font-semibold text-slate-600 mb-2">
                  Project Name
                </label>

                <input
                  className="border border-slate-300 p-3.5 rounded-xl w-full outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter project name"
                  value={newProject.name}
                  onChange={(event) =>
                    setNewProject({
                      ...newProject,
                      name: event.target.value,
                    })
                  }
                />

              </div>

              {/* Status */}
              <div>

                <label className="block text-sm font-semibold text-slate-600 mb-2">
                  Project Status
                </label>

                <select
                  className="border border-slate-300 p-3.5 rounded-xl w-full outline-none focus:ring-2 focus:ring-purple-500"
                  value={newProject.status}
                  onChange={(event) =>
                    setNewProject({
                      ...newProject,
                      status: event.target.value,
                    })
                  }
                >
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                </select>

              </div>

              {/* Description */}
              <div className="md:col-span-2">

                <label className="block text-sm font-semibold text-slate-600 mb-2">
                  Project Description
                </label>

                <textarea
                  className="border border-slate-300 p-3.5 rounded-xl w-full outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter project description"
                  rows="3"
                  value={newProject.description}
                  onChange={(event) =>
                    setNewProject({
                      ...newProject,
                      description: event.target.value,
                    })
                  }
                />

              </div>

              {/* Start Date */}
              <div>

                <label className="block text-sm font-semibold text-slate-600 mb-2">
                  Start Date
                </label>

                <input
                  type="date"
                  className="border border-slate-300 p-3.5 rounded-xl w-full outline-none focus:ring-2 focus:ring-purple-500"
                  value={newProject.startDate}
                  onChange={(event) =>
                    setNewProject({
                      ...newProject,
                      startDate: event.target.value,
                    })
                  }
                />

              </div>

              {/* End Date */}
              <div>

                <label className="block text-sm font-semibold text-slate-600 mb-2">
                  End Date
                </label>

                <input
                  type="date"
                  className="border border-slate-300 p-3.5 rounded-xl w-full outline-none focus:ring-2 focus:ring-purple-500"
                  value={newProject.endDate}
                  onChange={(event) =>
                    setNewProject({
                      ...newProject,
                      endDate: event.target.value,
                    })
                  }
                />

              </div>

              {/* Assign Employees */}
              <div className="md:col-span-2">

                <label className="block text-sm font-semibold text-slate-600 mb-2">
                  Assign Employees
                </label>

                <div className="border border-slate-300 rounded-xl p-4">

                  {employees.length === 0 ? (

                    <p className="text-slate-400 text-sm">
                      No employees available
                    </p>

                  ) : (

                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">

                      {employees.map((employee) => (

                        <label
                          key={employee._id}
                          className={
                            "flex items-center gap-3 p-3 rounded-xl cursor-pointer border " +
                            (
                              newProject.assignedEmployees.includes(
                                employee._id
                              )
                                ? "bg-purple-50 border-purple-300"
                                : "bg-slate-50 border-slate-200"
                            )
                          }
                        >

                          <input
                            type="checkbox"
                            className="w-4 h-4 accent-purple-600"
                            checked={newProject.assignedEmployees.includes(
                              employee._id
                            )}
                            onChange={() =>
                              toggleEmployee(employee._id)
                            }
                          />

                          <span className="text-sm font-medium">
                            {employee.name}
                          </span>

                        </label>

                      ))}

                    </div>

                  )}

                </div>

              </div>

            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-3 mt-7">

              {!editingProjectId ? (

                <button
                  onClick={addProject}
                  className="bg-purple-600 text-white px-7 py-3 rounded-xl font-semibold hover:bg-purple-700 transition"
                >
                  + Add Project
                </button>

              ) : (

                <>
                  <button
                    onClick={updateProject}
                    className="bg-purple-600 text-white px-7 py-3 rounded-xl font-semibold hover:bg-purple-700 transition"
                  >
                    ✓ Update Project
                  </button>

                  <button
                    onClick={resetProjectForm}
                    className="bg-slate-200 text-slate-700 px-7 py-3 rounded-xl font-semibold hover:bg-slate-300 transition"
                  >
                    Cancel
                  </button>
                </>

              )}

            </div>

          </div>

        </section>

        {/* All Projects */}
        <section>

          <div className="flex justify-between items-end mb-5">

            <div>

              <h2 className="text-2xl font-bold text-slate-900">
                All Projects
              </h2>

              <p className="text-slate-500 text-sm mt-1">
                View and manage all your projects.
              </p>

            </div>

            <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold">
              {projects.length} Projects
            </span>

          </div>

          {projects.length === 0 ? (

            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">

              <div className="text-5xl mb-4">
                📂
              </div>

              <p className="text-slate-400">
                No projects created yet.
              </p>

            </div>

          ) : (

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

              {projects.map((project) => {

                const progress = getProjectProgress(project._id);

                return (

                  <div
                    key={project._id}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition duration-300"
                  >

                    {/* Project Header */}
                    <div className="flex justify-between items-start gap-3">

                      <h3 className="font-bold text-xl text-slate-900">
                        {project.name}
                      </h3>

                      <span
                        className={
                          "px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap " +
                          (
                            project.status === "Completed"
                              ? "bg-green-100 text-green-700"
                              : project.status === "Pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-blue-100 text-blue-700"
                          )
                        }
                      >
                        {project.status}
                      </span>

                    </div>

                    {/* Description */}
                    <p className="text-slate-500 mt-3 text-sm leading-6">
                      {project.description}
                    </p>

                    {/* Dates */}
                    <div className="mt-5 bg-slate-50 rounded-xl p-4">

                      <div className="grid grid-cols-2 gap-4">

                        <div>

                          <p className="text-xs text-slate-400 uppercase font-semibold">
                            Start Date
                          </p>

                          <p className="font-semibold mt-1 text-sm">
                            {project.startDate
                              ? new Date(
                                  project.startDate
                                ).toLocaleDateString()
                              : "Not available"}
                          </p>

                        </div>

                        <div>

                          <p className="text-xs text-slate-400 uppercase font-semibold">
                            End Date
                          </p>

                          <p className="font-semibold mt-1 text-sm">
                            {project.endDate
                              ? new Date(
                                  project.endDate
                                ).toLocaleDateString()
                              : "Not available"}
                          </p>

                        </div>

                      </div>

                    </div>

                    {/* Employees */}
                    <div className="mt-5">

                      <p className="text-sm font-semibold text-slate-700">
                        Assigned Employees
                      </p>

                      {project.assignedEmployees &&
                      project.assignedEmployees.length > 0 ? (

                        <div className="flex flex-wrap gap-2 mt-3">

                          {project.assignedEmployees.map(
                            (employeeId) => {

                              const employee = employees.find(
                                (item) => item._id === employeeId
                              );

                              return (

                                <span
                                  key={employeeId}
                                  className="bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full text-xs font-semibold"
                                >
                                  👤{" "}
                                  {employee
                                    ? employee.name
                                    : "Employee"}
                                </span>

                              );
                            }
                          )}

                        </div>

                      ) : (

                        <p className="text-sm text-slate-400 mt-2">
                          No employees assigned
                        </p>

                      )}

                    </div>

                    {/* Progress */}
                    <div className="mt-6">

                      <div className="flex justify-between mb-2">

                        <span className="text-sm font-semibold">
                          Project Progress
                        </span>

                        <span className="text-sm font-bold text-purple-600">
                          {progress.percentage}%
                        </span>

                      </div>

                      <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">

                        <div
                          className="bg-purple-600 h-3 rounded-full transition-all duration-700"
                          style={{
                            width: progress.percentage + "%",
                          }}
                        ></div>

                      </div>

                      <p className="text-xs text-slate-500 mt-2">
                        {progress.completed} of {progress.total} tasks completed
                      </p>

                    </div>

                    {/* Buttons */}
                    <div className="flex gap-6 mt-6 pt-4 border-t border-slate-100">

                      <button
                        onClick={() => startEditProject(project)}
                        className="text-purple-600 font-semibold text-sm hover:text-purple-800"
                      >
                        ✏️ Edit
                      </button>

                      <button
                        onClick={() => deleteProject(project._id)}
                        className="text-red-500 font-semibold text-sm hover:text-red-700"
                      >
                        🗑️ Delete
                      </button>

                    </div>

                  </div>

                );
              })}

            </div>

          )}

        </section>

      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-center py-6 mt-12">

        <p className="font-semibold text-white">
          Project Management System
        </p>

        <p className="text-sm mt-1">
          © 2026 Project Management Module
        </p>

      </footer>

    </div>
  );
}

export default App;