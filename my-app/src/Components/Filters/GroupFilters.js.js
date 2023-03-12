import "./filter-styles.css";

export default function GroupFilters({handleFilters, groups}){
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
                <legend>Group Size</legend>
                <div className="filter-item">
                <label>
                <input type="checkbox" name="members" value="<10" onChange={(e) => {handleFilters(e);}}/>
                {' '}&#60 members</label>
                <label>
                <input type="checkbox" name="members" value="10-30" onChange={(e) => {handleFilters(e);}}/>
                {' '}10-30 members</label>
                <label>
                <input type="checkbox" name="members" value=">30" onChange={(e) => {handleFilters(e);}}/>
                {' '}&gt30 members </label>
                </div>
            </fieldset>
		</form>
	  );
}