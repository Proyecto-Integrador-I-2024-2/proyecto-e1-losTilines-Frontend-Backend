import React, { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Spinner,
  Typography,
} from "@material-tailwind/react";
import { FaRegLightbulb, FaUsers, FaProjectDiagram } from "react-icons/fa";
import {
  freelancersData as dummyFree,
  projectsData as dummyProj,
} from "@/data";
import { ProjectCard, SmallFreelancerCard } from "@/widgets/cards";
import { CustomList, CustomListItem } from "@/widgets/horList";
import { IconButton } from "@material-tailwind/react";
import { useFreelancers, useProjects, useQueryParams } from "@/hooks";
import { useNavigate } from "react-router-dom";
import { project_pic } from "@/data/placeholder";
import { LandingPage } from "@/widgets/home";
import { useNavigateWithQuery } from "@/hooks/utils";
import { func } from "prop-types";
import { useQuery } from "@tanstack/react-query";
import { Identifiers } from "@/hooks/tanstackIdentifiers";
import apiClient from "@/services/apiClient";
const Homepage = () => {


  const fetchProjects = async () => {

    const { data } = await apiClient.get("projects/");
    return data;
  };


  // We use a custom useQuery due to the dashboard projects fetch had the same identifier so,
  // when the user opened the dashboard, the projects were the home projects.
  // However, now they have different identifiers. 

  const { data: projectsData, isLoading: isProjectsLoading } = useQuery(

    [Identifiers.projectsHome], fetchProjects, {


    staleTime: 1000 * 60 * 3,
    cachetime: 1000 * 60 * 30,
    retry: 2,

  }

  );

  const { data: freelancersData, isLoading: isFreelancersLoading } = useFreelancers();
  const { getParams, setParams } = useQueryParams();
  const navigate = useNavigate();
  const navigateWithQuery = useNavigateWithQuery();
  const role = sessionStorage.getItem("role");

  function handleFreelancerCardClick(id) {
    // setParams({ freelancer: id });
    // console.log(getParams().get("freelancer"));
    // navigateWithQuery("/profile");
    navigate(`/profile?freelancer=${id}`);
  }
  function handleProjectCardClick(id) {
    navigate(`/project/detail/${id}`);  
  }

  return (
    <LandingPage>
      {freelancersData &&
        freelancersData.length > 0 &&
        projectsData &&
        projectsData.length > 0 && (
          <>
            <div className="flex flex-col max-h-1/3 my-8">
              <Typography
                variant="h2"
                className="text-4xl font-semibold text-center text-secondary mb-12"
              >
                Amazing Freelancers to work with!
              </Typography>

              {freelancersData && (
                <CustomList
                  sectionTitle={""}
                  sectionSubtitle={""}
                  isDistributedEvenly={true}
                >
                  {freelancersData.map((freelancer) => (
                    <SmallFreelancerCard
                      key={freelancer.user.id}
                      freelancer={freelancer}
                      onCardClick={handleFreelancerCardClick}
                    />
                  ))}
                </CustomList>
              )}
            </div>
            <div className="flex flex-col max-h-1/3 my-8">
              <Typography
                variant="h2"
                className="text-4xl font-semibold text-center text-secondary mb-12"
              >
                Incredible projects for you to hop on!
              </Typography>

              {projectsData && (
                <CustomList
                  sectionTitle={""}
                  sectionSubtitle={""}
                  isDistributedEvenly={true}
                >
                  {projectsData.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onCardClick={handleProjectCardClick}
                    />
                  ))}
                </CustomList>
              )}
            </div>
          </>
        )}
    </LandingPage>
  );
};

export default Homepage;
