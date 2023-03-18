import "./filter-styles.css";

export default function EventFilters({handleFilters, groups}){

    function GroupForm(){
        if (groups.length > 0) 
        return (groups.map(group => {
           return (
            <label>
            <input type="checkbox" name="groups" value={group} onChange={(e) => {handleFilters(e);}}/>
            {' '}{group}</label>
           )
     }))
    }
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
                <input type="date" name="startDate" onChange={(e) => {handleFilters(e);}}/>
                </label>
                <label>End Date<br></br>
                <input type="date" name="endDate" onChange={(e) => {handleFilters(e);}}/>
                </label>
                </div>
            </fieldset>
            <fieldset>
                <legend>Category</legend>
                <div className="filter-item">
                <label>
                <input type="checkbox" name="category" value="Walking" onChange={(e) => {handleFilters(e);}}/>
                {' '}Walking </label>
                <label>
                <input type="checkbox" name="category" value="Jogging" onChange={(e) => {handleFilters(e);}}/>
                {' '}Jogging </label>
                <label>
                <input type="checkbox" name="category" value="Running" onChange={(e) => {handleFilters(e);}}/>
                {' '}Running </label>
                <label>
                <input type="checkbox" name="category" value="Climbing" onChange={(e) => {handleFilters(e);}}/>
                {' '}Climbing </label>
                <label>
                <input type="checkbox" name="category" value="Biking" onChange={(e) => {handleFilters(e);}}/>
                {' '}Biking </label>
                <label>
                <input type="checkbox" name="category" value="Sports" onChange={(e) => {handleFilters(e);}}/>
                {' '}Sports </label>
                <label>
                <input type="checkbox" name="category" value="Other" onChange={(e) => {handleFilters(e);}}/>
                {' '}Other </label>
                </div>
            </fieldset>
            <fieldset>
                <legend>Your Groups</legend>
                <div className="filter-item">
                <GroupForm/>
                </div>
            </fieldset>
		</form>
	  );
}