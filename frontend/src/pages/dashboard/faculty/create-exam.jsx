const CreateExam = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-slate-800">Create New Examination</h3>
        <div className="flex gap-4">
          <button className="px-4 py-2 text-slate-600 bg-white border border-slate-200 rounded-md hover:bg-slate-50">
            Save as Draft
          </button>
          <button className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
            Publish Exam
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <form className="space-y-6">
          {/* Basic Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700">Subject Name</label>
              <input 
                type="text"
                className="mt-1 p-2 w-full border border-slate-200 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., Data Structures"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Exam Duration (minutes)</label>
              <input 
                type="number"
                className="mt-1 p-2 w-full border border-slate-200 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., 120"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Total Marks</label>
              <input 
                type="number"
                className="mt-1 p-2 w-full border border-slate-200 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., 100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Exam Date</label>
              <input 
                type="date"
                className="mt-1 p-2 w-full border border-slate-200 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Question Section */}
          <div className="mt-8">
            <h4 className="text-lg font-semibold text-slate-800 mb-4">Questions</h4>
            <div className="space-y-4">
              {/* Sample Question */}
              <div className="p-4 border border-slate-200 rounded-md">
                <div className="flex justify-between items-start mb-4">
                  <h5 className="text-sm font-medium text-slate-700">Question 1</h5>
                  <button className="text-red-600 hover:text-red-700">Delete</button>
                </div>
                <textarea 
                  className="w-full p-2 border border-slate-200 rounded-md mb-4"
                  rows="3"
                  placeholder="Enter your question here..."
                />
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input type="radio" name="correct_1" />
                    <input 
                      type="text" 
                      className="flex-1 p-2 border border-slate-200 rounded-md"
                      placeholder="Option 1"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="radio" name="correct_1" />
                    <input 
                      type="text" 
                      className="flex-1 p-2 border border-slate-200 rounded-md"
                      placeholder="Option 2"
                    />
                  </div>
                </div>
              </div>
            </div>
            <button className="mt-4 px-4 py-2 text-indigo-600 border border-indigo-200 rounded-md hover:bg-indigo-50">
              + Add Question
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateExam; 