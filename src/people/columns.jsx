export const columns = [
  {
    accessorKey: "id",
    header: () => <div className="text-center">Person ID</div>,
  },
  {
    accessorKey: "first_name",
    header: () => <div className="text-center">First Name</div>,
  },
  {
    accessorKey: "last_name",
    header: () => <div className="text-center">Last Name</div>,
  },
  {
    accessorKey: "email",
    header: () => <div className="text-center">Email</div>,
  },
  {
    accessorKey: "gender",
    header: () => <div className="text-center">Gender</div>,
  },
  {
    accessorKey: "date_of_birth",
    header: () => <div className="text-center">Date of Birth</div>,
    cell: ({ row }) => {
      const date_of_birth = row.getValue("date_of_birth");
      return <div className="font-medium">{date_of_birth}</div>;
    },
  },
];
