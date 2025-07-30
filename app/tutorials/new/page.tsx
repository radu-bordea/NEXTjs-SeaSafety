import NewTutorialForm from "./tutorial-form"; // Import the form component

const NewTutorialPage = () => {
  return (
    // Full-screen height container, centered horizontally and vertically
    <div className="min-h-screen w-full flex items-center justify-center px-4">
      {/* Render the form component */}
      <NewTutorialForm />
    </div>
  );
};

export default NewTutorialPage;
