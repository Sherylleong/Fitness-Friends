import "./filter-styles.css";

export default function Filters({handleFilters}){
	let groups = ["a","b"];
	return (
		<form className="events-form">
            <h1>Filters</h1>

            <fieldset>
                <legend>Intensity</legend>
                <div className="filter-item">
                <label>
                <input type="checkbox" name="Intensity" value="Low" onChange={(e) => {handleFilters(e);}}/>
                {' '}Low </label>
                <label>
                <input type="checkbox" name="Intensity" value="Moderate" onChange={(e) => {handleFilters(e);}}/>
                {' '}Moderate </label>
                <label>
                <input type="checkbox" name="Intensity" value="Vigorous" onChange={(e) => {handleFilters(e);}}/>
                {' '}Vigorous </label>
                </div>
            </fieldset>
            <fieldset>
                <legend>Date</legend>
                <div className="filter-item">
                <label>
                <input type="date" onChange={(e) => {handleFilters(e);}}/>
                </label>
                </div>
            </fieldset>
            <fieldset>
                <legend>Category</legend>
                <div className="filter-item">
                <label>
                <input type="checkbox" name="Category" value="Walking" onChange={(e) => {handleFilters(e);}}/>
                {' '}Walking </label>
                <label>
                <input type="checkbox" name="Category" value="Jogging" onChange={(e) => {handleFilters(e);}}/>
                {' '}Jogging </label>
                <label>
                <input type="checkbox" name="Category" value="Running" onChange={(e) => {handleFilters(e);}}/>
                {' '}Running </label>
                <label>
                <input type="checkbox" name="Category" value="Climbing" onChange={(e) => {handleFilters(e);}}/>
                {' '}Climbing </label>
                <label>
                <input type="checkbox" name="Category" value="Biking" onChange={(e) => {handleFilters(e);}}/>
                {' '}Biking </label>
                <label>
                <input type="checkbox" name="Category" value="Sports" onChange={(e) => {handleFilters(e);}}/>
                {' '}Sports </label>
                <label>
                <input type="checkbox" name="Category" value="Other" onChange={(e) => {handleFilters(e);}}/>
                {' '}Other </label>
                </div>
            </fieldset>
            <fieldset>
                <legend>Group</legend>
                {groups.map(group => {
           		return (
                    <div className="filter-item">
                    <label>
                    <input type="checkbox" name="Group" value={group} onChange={(e) => {handleFilters(e);}}/>
                    {' '}{group}</label>
                    </div>
           		)
         	})}
            </fieldset>
		</form>
	  );
}