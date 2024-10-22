import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Textarea,
  Button,
} from "@material-tailwind/react";
import { useUser, useCreateProject } from "@/hooks";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

export function AddProject({ open, setOpen }) {
  const { data: user } = useUser();
  const queryClient = useQueryClient();

  const [projectName, setProjectName] = useState("");
  const [budget, setBudget] = useState("");
  const [description, setDescription] = useState("");
  const [start_date, setDate] = useState("");
  const [infoFetch, setInfoFetch] = useState("");

  const createProjectMutation = useCreateProject();

  const handleProjectCreation = async () => {
    if (projectName && budget && description && start_date) {
      const projectData = {
        name: projectName,
        budget: budget,
        description: description,
        start_date: start_date,
        company: user?.company,
        user: user?.id,
      };

      try {
        createProjectMutation.mutate(projectData, {
          onSuccess: () => {
            setInfoFetch("Project created successfully");
            queryClient.invalidateQueries("projects");
            setOpen(false); // Cierra el diálogo después de crear el proyecto
          },
          onError: (error) => {
            setInfoFetch(`Error creating project: ${error.message}`);
          },
        });
      } catch (error) {
        console.error("Error creating project: ", error);
      }
    } else {
      alert("Please fill all fields before submitting.");
    }
  };

  return (
    <Dialog open={open} handler={() => setOpen(false)} size="md">
      <DialogHeader>Create a project</DialogHeader>
      <DialogBody divider>
        <div className="grid gap-6">
          <Input
            label="Name project"
            name="nameproject"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            size="lg"
            required
          />
          <Input
            label="Budget"
            name="budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            size="lg"
            required
          />
          <Textarea
            label="Description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            size="lg"
            required
          />
          <Input
            label="Start date"
            name="start_date"
            type="date"
            value={start_date}
            onChange={(e) => setDate(e.target.value)}
            size="lg"
          />
        </div>
      </DialogBody>
      <DialogFooter className="justify-end">
        <Button variant="text" color="red" onClick={() => setOpen(false)} className="mr-2">
          Cancel
        </Button>
        <Button variant="gradient" color="cyan" onClick={handleProjectCreation}>
          Save Changes
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

export default AddProject;