import "./filter-styles.css";
function GroupForm({handleFilters, groups}){
  
    let groupIds = Object.keys(groups)
    if (groupIds.length > 0)
    return (groupIds.map(groupid => {
       return (
        <label>
        <input type="checkbox" name="groups" value={groupid} onChange={(e) => {handleFilters(e);}}/>
        {' '}{groups[groupid]}</label>
       )
 }))
}
export default function EventFilters({filters, handleFilters, groups}){
    let groupIds = Object.keys(groups)
    var today = new Date()

    var month = (today.getMonth()+1) < 10 ? "0" + (today.getMonth()+1) : (today.getMonth()+1)
    var hour = today.getHours() < 10 ? "0" + today.getHours()  : today.getHours()
    var day = today.getDate() < 10 ? "0" + (today.getDate()) : (today.getDate())
    var minutes = today.getMinutes() < 10 ? "0" + today.getMinutes()  : today.getMinutes()
    var min = (today.getFullYear() + "-" + month + "-" + day);

	return (
		<form className="events-form">
            <fieldset>
                <legend>Difficulty</legend>
                <div className="filter-item">
                <label>
                <input type="checkbox" name="difficulty" value="Beginner" onChange={(e) => {handleFilters(e);}}/>
                {' '}Beginner </label>
                <label>
                <input type="checkbox" name="difficulty" value="Intermediate" onChange={(e) => {handleFilters(e);}}/>
                {' '}Intermediate </label>
                <label>
                <input type="checkbox" name="difficulty" value="Advanced" onChange={(e) => {handleFilters(e);}}/>
                {' '}Advanced </label>
                </div>
            </fieldset>
            <fieldset>
                <legend>Date</legend>
                <div className="filter-item">
                <label>Start Date<br></br>
                <input type="date" name="startDate" min={min} onChange={(e) => {handleFilters(e);}}/>
                </label>
                <label>End Date<br></br>
                <input type="date" name="endDate" min={min} onChange={(e) => {handleFilters(e);}}/>
                </label>
                </div>
            </fieldset>
            <fieldset>
                <legend>Category</legend>
                <div className="filter-item">
                <label>
                <input type="checkbox" name="category" value="Walking"  defaultChecked={filters['category'].includes("Walking")} onChange={(e) => {handleFilters(e);}}/>
                {' '}Walking </label>
                <label>
                <input type="checkbox" name="category" value="Jogging" defaultChecked={filters['category'].includes("Jogging")} onChange={(e) => {handleFilters(e);}}/>
                {' '}Jogging </label>
                <label>
                <input type="checkbox" name="category" value="Running" defaultChecked={filters['category'].includes("Running")} onChange={(e) => {handleFilters(e);}}/>
                {' '}Running </label>
                <label>
                <input type="checkbox" name="category" value="Climbing" defaultChecked={filters['category'].includes("Climbing")} onChange={(e) => {handleFilters(e);}}/>
                {' '}Climbing </label>
                <label>
                <input type="checkbox" name="category" value="Biking" defaultChecked={filters['category'].includes("Biking")} onChange={(e) => {handleFilters(e);}}/>
                {' '}Biking </label>
                <label>
                <input type="checkbox" name="category" value="Sports" defaultChecked={filters['category'].includes("Sports")} onChange={(e) => {handleFilters(e);}}/>
                {' '}Sports </label>
                <label>
                <input type="checkbox" name="category" value="Other" defaultChecked={filters['category'].includes("Other")} onChange={(e) => {handleFilters(e);}}/>
                {' '}Other </label>
                </div>
            </fieldset>
            <fieldset>
                <legend>Your Groups</legend>
                <div className="filter-item">
                <GroupForm handleFilters={handleFilters} groups={groups} />
                </div>
            </fieldset>
		</form>
	  );
}