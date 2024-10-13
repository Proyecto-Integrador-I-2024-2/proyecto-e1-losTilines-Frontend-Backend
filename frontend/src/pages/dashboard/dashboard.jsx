import { ListCard } from "@/widgets/list";
import { NumberInfo } from "@/widgets/statistics/numberInfo";
import Chart from "@/widgets/statistics/chart";
import { Button, Card, Spinner } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { useUser, useCreateArea, useWorkers, useQueryParams } from "@/hooks";
import { useState, useEffect } from "react";
import apiClient from "@/services/apiClient";
import { useQuery } from "@tanstack/react-query";
import { CreateAreaPopUp } from "@/widgets/areaWidgets";
import ListRowStructure from "@/widgets/list/listRowStructure";
import { LeftColumnRows } from "@/widgets/dashboard";
function Dashboard() {
  //Utils

  const navigateTo = useNavigate();
  const { getParams, setParams } = useQueryParams();

  const [selectItem, setSelectecItem] = useState(null);

  const { data: user, isLoading: userLoading } = useUser();

  const createAreaHook = useCreateArea();

  //TanksQuery

  /**
   * dataMidColumn manages informaction about:
   * 1. Freelancer milestones.
   * 2. Workers of a company and area.
   * 3. Freelancer related to projects of a project manager.
   */
  const [queryParamsMidColumn, setQueryparamsMidColum] = useState({});

  const [urlFetchMidColumn, setUrlFetchMidColumn] = useState("");

  const [midColumnTitle, setMidColumnTitle]= useState("");

  const {
    data: dataMidColumn,
    error: midColumnError,
    isLoading: isLoadingMidColumn,
  } = useQuery(
    ["MidColumnDashboard", urlFetchMidColumn, queryParamsMidColumn],
    async () => {
      if (urlFetchMidColumn) {
        const response = await apiClient.get(urlFetchMidColumn, {
          params: queryParamsMidColumn,
        });
        return response.data;
      }
      return null;
    },

    {
      enabled: !!urlFetchMidColumn,
    }
  );

  /**
   * dataLeftColumns manages information abaout:
   * 1. Areas from a business manager.
   * 2. Area admin projects.
   * 3. Project manager projects
   * 4. Freelancer projects.
   */

  const [queryParams, setQueryParams] = useState({});

  const [urlFetch, setUrlFetch] = useState("");

  const [leftColumnTitle, setLeftColumnTitle] = useState("");

  const {
    data: dataLeftColumn,
    error: errorLeftColumn,
    isLoading: isLoadingLeftColumn,
  } = useQuery(
    ["LeftColumnDashboard", urlFetch, queryParams],
    async () => {
      if (urlFetch) {
        const response = await apiClient.get(urlFetch, {
          params: queryParams,
        });
        return response.data;
      }
      return null;
    },
    {
      enabled: !!urlFetch,
    }
  );

  //Conditional render based on user role

  useEffect(() => {
    if (!userLoading) {
      if (sessionStorage.getItem("role") === "Business Manager") {

        setLeftColumnTitle("Areas");
        setParams({ rows: "areas" });

        setUrlFetch("areas/");
        setQueryParams({ company: user.company });

        setUrlFetchMidColumn("workers/");
        setQueryparamsMidColum({ company: user.company });
        setMidColumnTitle("Workers")
      }

      if (sessionStorage.getItem("role") === "Area Admin") {
        setLeftColumnTitle("Area projects");
        setParams({ rows: "Projects" });
        setUrlFetch("projects/");
        setQueryParams({ area: user.area });

        setUrlFetchMidColumn("workers/");
        setQueryparamsMidColum({ area: user.area });
        setMidColumnTitle(`${user.area}'s workers`)

      }

      if (sessionStorage.getItem("role") === "Project Manager") {
        setLeftColumnTitle("Projects");
        setParams({ rows: "projects" });
        setUrlFetch("projects/");
        setQueryParams({ worker: user.id });

        //Falta definir la ruta de fetch para MidColumn
        setMidColumnTitle("Hired freelancers")

      }

      if (sessionStorage.getItem("role") === "Freelancer") {
        setLeftColumnTitle("Projects");
        setParams({ rows: "projects" });
        setUrlFetch("projects/");
        setQueryParams({ freelancer: user.id });

        setMidColumnTitle("My milestones")
      }
    }
  }, [user]);

  const loadingSpinner = (
    <div className="flex flex-col justify-center items-center ">
      <Spinner className=" h-10 w-10" />
    </div>
  );

  return (
    <div className="h-full md:flex md:flex-row w-full my-2 px-2 min-h-0">
      {/* Left Column */}

      <section className="w-full h-96 flex flex-col md:mb-0 md:w-1/3 md:h-full md:max-h-none md:mr-6">
        <ListCard
          title={leftColumnTitle}
          hasSeeAll={() => navigateTo("areas/")}
          addContent={
            <CreateAreaPopUp
            />
          }
        >
          {isLoadingLeftColumn ? (
            loadingSpinner
          ) : (
            <LeftColumnRows
              setSelectedId={setSelectecItem}
              contentInfo={dataLeftColumn}
            />
          )}
        </ListCard>
      </section>

      {/* Right Big Column Container*/}

      <div className="flex flex-col  md:w-2/3  ">
        <section className="flex flex-col h-auto min-h-0 w-full mb-2 my-4 md:my-0 md:flex-row md:h-1/2  ">
          {/* Aquí iría el contenido para trabajadores y finanzas */}

          <div className="flex flex-col h-auto w-full md:space-x-6  md:flex-row  md:h-full">
            <div className="h-96 my-4 md:my-0 md:h-full md:w-full">
              <ListCard
                title={midColumnTitle}
                addContent={false}
                hasSeeAll={() => navigateTo("workers/")}
              >





              </ListCard>
            </div>
            <ListCard
              title={"Finance"}
              hasAdd={false}
              hasSeeAll={() => {}}
            >
              <NumberInfo
                description={"Total investment in projects"}
                number={"$2.500.000"}
              />
            </ListCard>
          </div>
        </section>

        {/* Statistics content */}

        <Card className="flex w-full flex-col mb-2 p-4 h-auto items-center md:h-1/2 md:mt-2 md:mb-0">
          <div className="flex h-auto w-full flex-col md:flex-row md:h-full justify-center items-center">
            <Chart description={"Monthly expenses for 2024"} type={"pie"} />
            <Chart description={"Percentage of budget by area"} type={"bar"} />
            <Chart
              description={"Percentage of projects by status"}
              type={"pie"}
            />
          </div>
          <Link to="stats/">
            <Button color="gray" size="sm" variant="outlined" className="w-32">
              See all
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;
