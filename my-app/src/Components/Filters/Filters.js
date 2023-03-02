export default function Filters(){
	let groups = ["a","b"];
	function handleFilters(){}
	return (
		<form>
            <fieldset>
                <legend>Intensity</legend>
                <input type="checkbox" name="Intensity" value="Low" onChange={(e) => {handleFilters(e);}}/>
                <label for="Low">Low</label>
                <input type="checkbox" name="Intensity" value="Moderate" onChange={(e) => {handleFilters(e);}}/>
                <label for="Moderate">Moderate</label>
                <input type="checkbox" name="Intensity" value="Vigorous" onChange={(e) => {handleFilters(e);}}/>
                <label for="Vigorous">Vigorous</label>
            </fieldset>
            <fieldset>
                <legend>Date</legend>
                <label>Start Date</label>
                <input type="date" onChange={(e) => {handleFilters(e);}}/>
                <label>End Date</label>
                <input type="date" onChange={(e) => {handleFilters(e);}}/>
            </fieldset>
            <fieldset>
                <legend>Category</legend>
                <input type="checkbox" name="Category" value="Walking" onChange={(e) => {handleFilters(e);}}/>
                <label for="Walking">Walking</label>
                <input type="checkbox" name="Category" value="Jogging" onChange={(e) => {handleFilters(e);}}/>
                <label for="Jogging">Jogging</label>
                <input type="checkbox" name="Category" value="Running" onChange={(e) => {handleFilters(e);}}/>
                <label for="Running">Running</label>
                <input type="checkbox" name="Category" value="Climbing" onChange={(e) => {handleFilters(e);}}/>
                <label for="Climbing">Climbing</label>
                <input type="checkbox" name="Category" value="Biking" onChange={(e) => {handleFilters(e);}}/>
                <label for="Biking">Biking</label>
                <input type="checkbox" name="Category" value="Sports" onChange={(e) => {handleFilters(e);}}/>
                <label for="Sports">Sports</label>
                <input type="checkbox" name="Category" value="Other" onChange={(e) => {handleFilters(e);}}/>
                <label for="Other">Other</label>
            </fieldset>
            <fieldset>
                <legend>Group</legend>
                {groups.map(group => {
           		return (
                    <>
                    <input type="checkbox" name="Group" value={group} onChange={(e) => {handleFilters(e);}}/>
                    <label for="Group">{group}</label>
                    </>
           		)
         	})}
            </fieldset>
		</form>
	  );
}