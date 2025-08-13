import NewTutorialForm from "./tutorial-form"; // Import the tutorial form component

const NewTutorialPage = () => {
  return (
    // Full-page container to center the form
    <div className="min-h-screen w-full flex items-center justify-center px-4">
      {/* Render the tutorial submission form */}
      <NewTutorialForm />
    </div>
  );
};

export default NewTutorialPage;
