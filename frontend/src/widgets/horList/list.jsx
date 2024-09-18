import {
    Typography,
} from "@material-tailwind/react";



export function CustomList({ children, sectionTitle, sectionSubtitle }) {
    return (
        <div className="px-4 pb-4 overflow-x-auto whitespace-nowrap">
            <Typography variant="h6" color="blue-gray" className="mb-2">
                {sectionTitle}
            </Typography>
            <Typography
                variant="small"
                className="font-normal text-blue-gray-500"
            >
                {sectionSubtitle}
            </Typography>
            <div className="inline-flex gap-12">
                {children}
            </div>
        </div>
    )
}

export default CustomList;
