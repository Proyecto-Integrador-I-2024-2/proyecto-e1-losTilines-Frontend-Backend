// ProjectDetail.jsx

import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Button,
  Alert,
} from "@material-tailwind/react";
import {
  EllipsisVerticalIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/solid";
import { SkillsSection } from "@/widgets/custom";
import { useParams, useNavigate } from "react-router-dom";
import { useQueryParams, useUser } from "@/hooks";
import { useProject } from "@/hooks";
import { profile_pic } from "@/data/placeholder";
import {
  EditProjectPopUp,
  EditSkillsPopup,
  FreelancerInterestPopUp,
} from "@/widgets/popUp";
import {
  addSkillToProject,
  deleteProjectSkill,
  editProject,
  editProjectSkill,
  postFreelancerInterest,
} from "@/services";
import { useQueryClient } from "@tanstack/react-query";
import apiClient from "@/services/apiClient";
import { CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";

export function ProjectDetail() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { getParams } = useQueryParams();
  const { id } = useParams();
  const [showSkillsPopUp, setShowSkillsPopUp] = useState(false);
  const [showEditProjectPopUp, setShowEditProjectPopUp] = useState(false);
  const [freelancerInterestPopUp, setFreelancerInterestPopUp] = useState(false);
  const [validInterest, setValidInterest] = useState(true);
  const role = sessionStorage.getItem("role");
  const [submitted, setSubmitted] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  console.log("ID del proyecto:", id); // Para depuración

  // Obtener la información del proyecto usando el hook
  const {
    data: project,
    isLoading,
    error,
    refetch: projectRefetch,
  } = useProject(id);
  const {
    data: userData,
    isLoading: isUserLoading,
    refetch: userRefetch,
  } = useUser();

  console.log("Datos de usuario:", userData); // Para depuración

  useEffect(() => {
    if (userData?.projects) {
      const userProjects = userData.projects;
      const projectIds = userProjects.map((project) => project.id);
      console.log("IDs de proyectos del usuario:", projectIds);
      if (projectIds.includes(parseInt(id))) {
        console.log("El usuario no puede tirar interest este proyecto.");
        setValidInterest(false);
      }
    }
  }, [userData]);

  useEffect(() => {
    const projectIdFromQuery = getParams().get("project");
    if (projectIdFromQuery && projectIdFromQuery !== id) {
      console.log(
        `Redirigiendo a la ID del proyecto desde query params: ${projectIdFromQuery}`
      );
      navigate(`/project/detail/${projectIdFromQuery}`);
    }
  }, [getParams, navigate, id]);


  // Manejo de estado de carga y error
  if (isLoading) {
    return (
      <Typography variant="h6" color="gray">
        Cargando detalles del proyecto...
      </Typography>
    );
  }

  if (error) {
    return (
      <Typography variant="h6" color="red">
        Error al cargar el proyecto: {error.message}
      </Typography>
    );
  }

  // Verifica si project existe antes de intentar acceder a sus propiedades
  if (!project) {
    return (
      <Typography variant="h6" color="red">
        Proyecto no encontrado.
      </Typography>
    );
  }

  // Project Skill Data
  function handleAddSkill(body) {

    const skillToAddData = {
      project: id,
      skill: body.skill,
      level: body.level,
    };
    addSkillToProject({ body: skillToAddData });
    queryClient.invalidateQueries(["project", id]);
    projectRefetch();
  }

  function handleEditSkill(id, body) {
    const skillToEditData = {
      level: Number(body.level),
    };
    editProjectSkill({ id, body: skillToEditData });
    console.log("ID de proyecto al editar", id);
    queryClient.invalidateQueries(["project", id]);
    projectRefetch();
  }

  function handleDeleteSkill(id) {
    console.log("ID", id);
    deleteProjectSkill({ id });
    queryClient.invalidateQueries(["project", id]);
    projectRefetch();
  }

  // Project basic Data
  async function handleEditProject(body) {
    const { data, status } = await editProject({ id, body });
    if (status > 199) {
      setSubmitted(true);
      queryClient.invalidateQueries(["project", id]);
      const userId = sessionStorage.getItem("id");
      queryClient.invalidateQueries(["freelancer_projects", userId]);
      queryClient.invalidateQueries(["worker_projects", userId]);
      projectRefetch();
      setTimeout(() => {
        setSubmitted(false);
      }, 3000)
    } else {
      setDeleteError("Hubo un error al eliminar el proyecto de codigo");
      console.error("Error deleting project:", status);
      setTimeout(() => {
        setDeleteError(null);
      }, 3000)

    }

  }

  async function handleDeleteProject() {
    try {
      const { status } = await apiClient.delete(`/projects/${id}/`);
      if (status === 204) {
        setSubmitted(true);
        queryClient.invalidateQueries(["project", id]);
        queryClient.invalidateQueries(["projects"]);
        setTimeout(() => {
          setSubmitted(false);
          navigate("/");
        }, 3000)
      } else {
        throw new Error("Code error: " + status);
      }
    } catch (error) {
      setDeleteError("Hubo un error al eliminar el proyecto de codigo");
      console.error("Error deleting project:", error);
      setTimeout(() => {
        setDeleteError(null);
      }, 3000)
    }



  }

  // Freelancer Interest
  function handleFreelancerInterest() {
    const body = {
      project: id,
      freelancer: 0,
      status: "freelancer_interested",
    };

    postFreelancerInterest(body);
  }

  return (
    <>
      <div className="w-full h-full">
        <div className="mx-3 mt-4 mb-4 lg:mx-4">
          <Card className="inline-flex w-full border border-blue-gray-100 mb-2">
            <CardBody className="h-full p-4">
              <div className="flex items-center justify-between flex-wrap gap-6 h-auto">
                <div className="flex items-center gap-6">
                  <Avatar
                    src={project.user.profile_picture || profile_pic}
                    alt="Project Image"
                    size="xl"
                    variant="rounded"
                    className="rounded-lg shadow-lg shadow-blue-gray-500/40"
                  />
                  <div>
                    <Typography variant="h5" color="blue-gray" className="mb-1">
                      {project.user.first_name + " " + project.user.last_name}
                    </Typography>
                    <Typography
                      variant="small"
                      className="font-normal text-blue-gray-600"
                    >
                      {project.user.email}
                    </Typography>
                  </div>
                </div>
                {role == "Freelancer" && validInterest && (
                  <Button
                    color="light-blue"
                    onClick={() => setFreelancerInterestPopUp((prev) => !prev)}
                  >
                    Apply Now!
                  </Button>
                )}
              </div>
            </CardBody>
          </Card>
          <div className="mb-4 grid grid-cols-1 gap-6 xl:grid-cols-3">
            <Card className="overflow-hidden xl:col-span-2 border border-blue-gray-100 shadow-sm">
              <CardHeader
                floated={false}
                shadow={false}
                color="transparent"
                className="m-0 flex items-center justify-between px-6 pt-6 pb-0"
              >
                <div>
                  <Typography variant="h4" color="blue-gray" className="mb-1">
                    {project.name}
                  </Typography>
                  <Typography
                    variant="h6"
                    className="flex items-center gap-1 font-normal text-blue-gray-600"
                  >
                    <CurrencyDollarIcon
                      strokeWidth={5}
                      className="h-6 w-6 text-light-green-600"
                    />
                    <strong>{project.budget}</strong>
                  </Typography>
                </div>

                {
                  role && role != "Freelancer" && (

                    <Menu placement="left-start">
                      <MenuHandler>
                        <IconButton size="sm" variant="text" color="blue-gray">
                          <EllipsisVerticalIcon
                            id="3puntos"
                            strokeWidth={3}
                            fill="currenColor"
                            className="h-6 w-6"
                          />
                        </IconButton>
                      </MenuHandler>
                      <MenuList>
                        <MenuItem
                          onClick={() => setShowEditProjectPopUp((prev) => !prev)}
                        >
                          Edit project information
                        </MenuItem>
                        <MenuItem
                          onClick={() => setShowSkillsPopUp((prev) => !prev)}
                        >
                          Edit project skills
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  )
                }
              </CardHeader>
              <CardBody className="flex flex-col items-start justify-between">
                <Typography
                  variant="paragraph"
                  color="black"
                  className="text-lg"
                >
                  {project.description}
                </Typography>

                <Typography
                  variant="h3"
                  color="light-blue"
                  textGradient
                  className="my-2"
                >
                  {" "}
                  {project.status_name}{" "}
                </Typography>
                <div className="flex flex-row w-full justify-between">
                  <Typography variant="lead" color="black" className="text-lg">
                    Fecha de inicio: {project.start_date}
                  </Typography>
                  <Typography variant="h5" color="blue">
                    {project.status.replace(/_/g, " ")}
                  </Typography>
                </div>
              </CardBody>
            </Card>
            <Card className="border border-blue-gray-100 shadow-sm max-h-full">
              <CardBody className="my-6 h-104 pt-0 pb-10">
                <Typography variant="h5" color="black">
                  {" "}
                  Skills needed{" "}
                </Typography>
                <SkillsSection sectionName={""} skills={project.skills || []} />
              </CardBody>
            </Card>
          </div>
        </div>
        {submitted && (
          <Alert
            variant="gradient"
            color="green"
            className="mt-4"
            icon={
              <CheckCircleIcon className="h-6 w-6" />
            }
          >
            Proyecto modificado exitosamente.
          </Alert>
        )}
        {deleteError && (
          <Alert
            variant="gradient"
            color="red"
            className="mt-4"
            icon={
              <ExclamationCircleIcon className="h-6 w-6" />
            }
          >
            Hubo un error al eliminar tu proyecto. Por favor, inténtalo de nuevo.
          </Alert>
        )}
      </div>
      <EditSkillsPopup
        open={showSkillsPopUp}
        onOpen={setShowSkillsPopUp}
        skills={project.skills || []}
        editSkill={handleEditSkill}
        addSkill={handleAddSkill}
        deleteSkill={handleDeleteSkill}
      />
      <EditProjectPopUp
        open={showEditProjectPopUp}
        setOpen={setShowEditProjectPopUp}
        project={project}
        handleProjectSave={handleEditProject}
        onDelete={handleDeleteProject}
      />
      <FreelancerInterestPopUp
        open={freelancerInterestPopUp}
        onOpen={setFreelancerInterestPopUp}
        handleInterest={handleFreelancerInterest}
        project={project}
      />
    </>
  );
}

export default ProjectDetail;
