import Sidebar from "./Sidebar";

const Results = () => {
    return (
        <div>
            <Sidebar />

            <div className="p-4 sm:ml-64 ">

            {/*    a card made with tailwind css with patient name, cancer variant name diagnosed with and other relevant info*/}
                <div className="flex flex-wrap mt-6 flex-row">
                    <div className="flex flex-wrap w-1/2">
                        <div className="flex flex-col items-center justify-center mb-5 mr-5 min-w-[300px] p-7 bg-white border-2 border-solid rounded-lg hover:bg-[#c8529e] hover:text-white transition duration-75 ease-in-out cursor-pointer">
                            <div className="flex items-center mb-3">
                                <p className="mx-3 text-3xl">Malignant</p>
                            </div>
                            <p className="text-3xl font-semibold opacity-75 "></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Results