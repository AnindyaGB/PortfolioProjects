
var departmentNames = []
var departmentIDsForobj = []
var departmentsObj = {}



 /*Scroll to top when arrow up clicked BEGIN*/
 $(window).scroll(function() {
    var height = $(window).scrollTop();
    if (height > 100) {
        $('#back2Top').fadeIn();
    } else {
        $('#back2Top').fadeOut();
    }
});
 /*Scroll to top when arrow up clicked END*/

 $.ajax({ //GET ALL DEPARTMENTS
    
    url: "libs/php/getAllDepartments.php",
    type: 'POST',
    dataType: 'json',
    
    success: function(result) {
               
    if (result.status.name == "ok") {
        console.log(result)
        var departmentDropdown = document.getElementById("departmentDropdown");
        var myDiv = document.getElementById("cboxes");
        for(var i = 0; i < result['data'].length; i++){
            var listItem = document.createElement("li");
            var checkBox = document.createElement("input");
            var label = document.createElement("label");
            checkBox.type = "checkbox";
            checkBox.value = result['data'][i]['name'];
            myDiv.appendChild(listItem);
            listItem.appendChild(checkBox);
            listItem.appendChild(label);
            label.appendChild(document.createTextNode(result['data'][i]['name']));

            var opt = result['data'][i]['name'];
            var val = result['data'][i]['id'];
            departmentNames.push(opt);
            departmentIDsForobj.push(val);
            var el = document.createElement("option");
            var el2 = document.createElement("option");
            var el3 = document.createElement("option");
            var el4 = document.createElement("option");

            el.textContent = opt;
            el.value = val;
            el2.textContent = opt;
            el2.value = val;
            el3.textContent = opt;
            el3.value = opt;
            el4.textContent = opt;
            el4.value = opt;
            departmentDropdown.appendChild(el); 
            newPersonnelDept.appendChild(el2);
            editPersonnelDept.appendChild(el3);
            departmentEditDropdown.appendChild(el4);
        }
      // alert(result)
      departmentNames.forEach((departmentNames,i) => departmentsObj[departmentNames] = departmentIDsForobj[i]);
        console.log(departmentsObj)
    }
    
    },
    error: function(jqXHR, textStatus, errorThrown) {
        // your error code
        console.log(errorThrown)
    } 
    
        });

function getEveryone() {


        $.ajax({ //GET EVERYONE
    
            url: "libs/php/getAll.php",
            type: 'GET',
            dataType: 'json',
        
            success: function(result) {
                       
            if (result.status.name == "ok") {
                console.log(result)
                console.log(result['data'].length)

                for(var i = 0; i < result['data'].length; i++)
           {

            /*
               if(i%2 == 0){
                   var row = i;
               }else{
                   var row = i-1;
            }*/
            if(i%3 == 0){
                var row = i;
            }else if(i%3 == 1){
                var row = i-1;
         }else{
            var row = i-2;
         }

            const removeable = document.createElement('div');
            removeable.id = 'removeable';

            const div = document.createElement('div');
            div.className = 'row';
            div.id = 'first'+ row;
            
            const div_2 = document.createElement('div');
            div_2.className = 'col-sm-4';
            div_2.id = 'second'+ i;

            const div_3 = document.createElement('div');
            div_3.className = 'panel';
            div_3.id = 'third'+ i;

            const div_4 = document.createElement('div');
            div_4.className = 'panel-body p-t-10';
            div_4.id = 'fourth'+ i;

            const div_5 = document.createElement('div');
            div_5.className = 'media-main';
            div_5.id = 'fifth'+ i;

            const div_6 = document.createElement('div');
            div_6.className = 'info';
            div_6.id = 'sixth'+ i;
            var bigName = document.createElement("h4");
            bigName.innerHTML = result['data'][i]['firstName'] + ' ' + result['data'][i]['lastName'];
            var email = document.createElement("p");
            email.innerHTML = result['data'][i]['email'];
            email.className = 'text-muted';
            var place = document.createElement("p");
            place.innerHTML = result['data'][i]['department'] + " - " + result['data'][i]['location'];
            place.className = 'text-muted';

            var infoButton = document.createElement("button");
            infoButton.type = "button";
            infoButton.className = "information btn btn-primary";
            infoButton.id = 'infoButton' + i;
            infoButton.innerHTML = 'See Info';
            //infoButton.onclick='infoFunction(this)';

            
            const div_7 = document.createElement('div');
            div_7.className = 'pull-right btn-group-sm';
            div_7.id = 'seventh'+ i;

            var x = document.createElement("button");
            x.type = "button";
            x.className = "edit btn btn-primary";
            x.id = 'button' + i;

            var y = document.createElement("i");
            y.className = "fa fa-pencil";

            var g = document.createElement("button");
            g.type = "button";
            g.className = "delete btn btn-danger tooltips";
            g.id = 'buttonDel' + i;

            var h = document.createElement("i");
            h.className = "fa fa-close";

            var line = document.createElement("hr");

            document.getElementById('content').appendChild(removeable);
            document.getElementById('removeable').appendChild(div);
            document.getElementById('first'+row).appendChild(div_2);
            document.getElementById('second'+i).appendChild(div_3);
            document.getElementById('third'+i).appendChild(div_4);
            document.getElementById('fourth'+i).appendChild(div_5);
            document.getElementById('fifth'+i).appendChild(div_7);
            document.getElementById('seventh'+i).appendChild(x);
            document.getElementById('button'+i).appendChild(y);

            document.getElementById('seventh'+i).appendChild(g);
            document.getElementById('buttonDel'+i).appendChild(h);

            document.getElementById('fifth'+i).appendChild(div_6);
            document.getElementById('sixth'+i).appendChild(bigName);
            document.getElementById('sixth'+i).appendChild(place);
           //document.getElementById('sixth'+i).appendChild(email);
            
            document.getElementById('sixth'+i).appendChild(infoButton);
            document.getElementById('fourth'+i).appendChild(line);
            
               

           }

           var allButtons = document.querySelectorAll('button[class^=information]');
           console.log("Found", allButtons.length, "div which class starts with “button”.");
           for (var i = 0; i < allButtons.length; i++) {
            allButtons[i].addEventListener('click', function() {
                


              var buttonId = this.id;
              var buttonNum = buttonId.substring(10)
              $('#infoTitle2').html(result['data'][buttonNum]['firstName'] + ' ' + result['data'][buttonNum]['lastName']);
              $('#departmentTxt').html(result['data'][buttonNum]['department']);
                $('#roleTxt').html(result['data'][buttonNum]['jobTitle']);
                $('#locationTxt').html(result['data'][buttonNum]['location']);
                $('#emailTxt').html(result['data'][buttonNum]['email']);
              $('#exampleModal').modal('show');
              console.log("You clicked:", result['data'][buttonNum]['firstName']);

            });
          }

          var editButtons = document.querySelectorAll('button[class^=edit]');
          console.log("Found", editButtons.length, "div which class starts with edit.");
          for (var i = 0; i < editButtons.length; i++) {
            editButtons[i].addEventListener('click', function() {
               


             var editbuttonId = this.id;
             var editbuttonNum = editbuttonId.substring(6)
             console.log(editbuttonId)
             $('#infoTitle').html('Edit ' + result['data'][editbuttonNum]['firstName'] + ' ' + result['data'][editbuttonNum]['lastName']);

             document.getElementById("editFirstName").defaultValue = result['data'][editbuttonNum]['firstName'];
             document.getElementById("editLastName").defaultValue = result['data'][editbuttonNum]['lastName'];
             document.getElementById("editJobTitle").defaultValue = result['data'][editbuttonNum]['jobTitle'];
             document.getElementById("editEmail").defaultValue = result['data'][editbuttonNum]['email'];
            // $('#emailTxt').html(result['data'][editbuttonNum]['email']);
             $("#editPersonnelDept").val(defaultValue = result['data'][editbuttonNum]['department']);
             document.getElementById("emailOld").defaultValue = result['data'][editbuttonNum]['email'];             
             $('#editModal').modal('show');
             console.log("You clicked:", result['data'][editbuttonNum]['email']);

           });
         }

          var delButtons = document.querySelectorAll('button[class^=delete]');
          console.log("Found", delButtons.length, "div which class starts with “delete”.");
          for (var i = 0; i < delButtons.length; i++) {
            delButtons[i].addEventListener('click', function() {
               


             var delbuttonId = this.id;
             var delbuttonNum = delbuttonId.substring(9)
             //console.log(delbuttonId)
             $('#delTitle').html('Are you sure you want to delete ' + result['data'][delbuttonNum]['firstName'] + ' ' + result['data'][delbuttonNum]['lastName']);

             $('#departmentDel').html(result['data'][delbuttonNum]['department']);
                $('#roleDel').html(result['data'][delbuttonNum]['jobTitle']);
                $('#locationDel').html(result['data'][delbuttonNum]['location']);
             $('#emailDel').html(result['data'][delbuttonNum]['email']);
             $('#deletePersonnelRealModal').modal('show');
             console.log("You clicked:", result['data'][delbuttonNum]['email']);

           });
         }

            }
            /*
            $('.information').on('click', function () {
                //alert('shaggin');
               $('#exampleModal').modal('show');

               for(var i = 0; i < result['data'].length; i++){
                if(infoButton.id == 'infoButton' + i){
                    console.log(result['data'][i]['firstName'])
                }
               }
   })*/
            },
            error: function(jqXHR, textStatus, errorThrown) {
                // your error code
                console.log(errorThrown)
            } 
            
                });
            }

            $(document).ready(function() {
                $("#back2Top").click(function(event) {
                    event.preventDefault();
                    $("html, body").animate({ scrollTop: 0 }, "slow");
                    return false;
                });
                getEveryone()

            });

                $('#newDepartmentForm').submit(function() { //ADD NEW DEPARTMENT
                    var formData = document.getElementById("newDepartmentForm");
                $.ajax({ //
    
                    url: "libs/php/insertDepartment.php",
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        name: newDepartmentForm.elements[0].value,
                        locationID: newDepartmentForm.elements[1].value
                    },

                    success: function(result) {
                               
                    if (result.status.name == "ok") {
                        console.log(result)
                        
                      // alert(result)
                    }
                    
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        // your error code
                        console.log(errorThrown)
                    } 
                    
                        });
                    });

                    $.ajax({ //GET ALL LOCATIONS
    
                        url: "libs/php/getAllLocations.php",
                        type: 'POST',
                        dataType: 'json',
                        
                        success: function(result) {
                                   
                        if (result.status.name == "ok") {
                            console.log(result)
                            var locationDropdown = document.getElementById("locationDropdown");

                            for(var i = 0; i < result['data'].length; i++){
                            var opt = result['data'][i]['name'];
                            var val = result['data'][i]['id'];
                            var el = document.createElement("option");
                            var el2 = document.createElement("option");
                            var el3 = document.createElement("option");

                            el.textContent = opt;
                            el.value = val;
                            el2.textContent = opt;
                            el2.value = val;
                            el3.textContent = opt;
                            el3.value = opt;
                            locationDropdown.appendChild(el); 
                            locationDropdown2.appendChild(el2);
                            locationEditDropdown.appendChild(el3);
                            }
                        }
                        
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            // your error code
                            console.log(errorThrown)
                        } 
                        
                            });
    
                            $('#deleteDepartment').on('click', function() { //DELETE LOCATION
                                //var formData = document.getElementById("newDepartmentForm");
                                //console.log(departmentNames)
                                $.ajax({ //GET ALL DEPARTMENTS

                                    url: "libs/php/containsEmployees.php",
                                    type: 'POST',
                                    dataType: 'json',
                                    data: {
                                        departmentName: deleteDepartmentForm.elements[0].value
                                    },

                                    success: function(result) {
                                               
                                    if (result.status.name == "ok") {
                                        console.log(result['data'].length)
                                        if(result['data'].length != 0){
                                            $('#deleteErrorModal').modal('show')
                                        }else{

                                            $('#deleteDepartmentRealModal').modal('show')
                                        }

                                    
                                    }
                                    
                                    },
                                    error: function(jqXHR, textStatus, errorThrown) {
                                        // your error code
                                        console.log(errorThrown)
                                    } 
                                    
                                        });
                                    });

                            $('#deleteDepartmentReal').on('click', function() { //DELETE DEPARTMENT 
                                var formData = document.getElementById("newDepartmentForm");
                                var IDiThink = departmentsObj[deleteDepartmentForm.elements[0].value];
                                console.log(IDiThink)
                                

                            $.ajax({ 
                
                                url: "libs/php/deleteDepartmentByID.php",
                                type: 'POST',
                                dataType: 'json',
                                data: {
                                    id: deleteDepartmentForm.elements[0].value
                                },
            
                                success: function(result) {
                                           
                                if (result.status.name == "ok") {
                                    console.log(result)
                                    
                                  // alert(result)
                                }
                                
                                },
                                error: function(jqXHR, textStatus, errorThrown) {
                                    // your error code
                                    console.log(errorThrown)
                                } 
                                
                                    });
                                });
                               
        $('#deleteLocation').on('click', function() { //DELETE LOCATION
                                    var formData = document.getElementById("newDepartmentForm");
                                    //alert(deleteLocationForm.elements[0].value)
                                    $.ajax({ //GET ALL DEPARTMENTS
    
                                        url: "libs/php/containsDepartments.php",
                                        type: 'POST',
                                        dataType: 'json',
                                        data: {
                                            locationID: deleteLocationForm.elements[0].value
                                        },
                                        success: function(result) {
                                                   
                                        if (result.status.name == "ok") {

                                            if(result['data'].length != 0){
                                                $('#deleteErrorModal').modal('show')
                                            }else{
    
                                                $('#deleteLocationRealModal').modal('show')
                                            }
                                            /*
                                            locationIDs = [];
                                            for(var i = 0; i < result['data'].length; i++){
                                                locationIDs.push(result['data'][i]['locationID'])
                                            }
                                            if(locationIDs.includes(deleteLocationForm.elements[0].value)){
                                                alert("Location has departments")
                                            }else{
                                                $('#deleteLocationRealModal').modal('show')
                                            }
                                            */
                                        }
                                        
                                        },
                                        error: function(jqXHR, textStatus, errorThrown) {
                                            // your error code
                                            console.log(errorThrown)
                                        } 
                                        
                                            });
                                        });
                                
                                $('#deleteLocationReal').on('click', function() { 
                                $.ajax({ //retrieve country name based on users click
                    
                                    url: "libs/php/deleteLocationByID.php",
                                    type: 'POST',
                                    dataType: 'json',
                                    data: {
                                        id: deleteLocationForm.elements[0].value
                                    },
                
                                    success: function(result) {
                                               
                                    if (result.status.name == "ok") {
                                        console.log(result)
                                        
                                      // alert(result)
                                    }
                                    
                                    },
                                    error: function(jqXHR, textStatus, errorThrown) {
                                        // your error code
                                        console.log(errorThrown)
                                    } 
                                    
                                        });
                                    });
                                
                                    $('#deletePersonnelReal').on('click', function() { 
                                        //console.log(document.getElementById('emailDel').innerHTML)
                                        
                                        
                                        $.ajax({ //retrieve country name based on users click
                    
                                            url: "libs/php/deleteEmployeeByName.php",
                                            type: 'POST',
                                            dataType: 'json',
                                            data: {
                                                email: document.getElementById('emailDel').innerHTML
                                            },
                        
                                            success: function(result) {
                                                       
                                            if (result.status.name == "ok") {
                                                
                                              //  $('#successModal').modal('show')
                                              // alert(result)
                                            }
                                            
                                            },
                                            error: function(jqXHR, textStatus, errorThrown) {
                                                // your error code
                                                console.log(errorThrown)
                                            } 
                                            
                                                });
                                    });
                                
  $('#newLocationForm').submit(function() { //ADD NEW LOCATION 
                                    var formData = document.getElementById("newLocationForm");
                                $.ajax({ //retrieve country name based on users click
                    
                                    url: "libs/php/insertLocation.php",
                                    type: 'POST',
                                    dataType: 'json',
                                    data: {
                                        name: newLocationForm.elements[0].value
                                    },
                
                                    success: function(result) {
                                               
                                    if (result.status.name == "ok") {
                                        console.log(result)
                                        
                                      // alert(result)
                                    }
                                    
                                    },
                                    error: function(jqXHR, textStatus, errorThrown) {
                                        // your error code
                                        console.log(errorThrown)
                                    } 
                                    
                                        });
    });

    $('#newPersonnelForm').submit(function() { //ADD NEW DEPARTMENT
        var formData = document.getElementById("newPersonnelForm");
    $.ajax({ //retrieve country name based on users click

        url: "libs/php/insertPersonnel.php",
        type: 'POST',
        dataType: 'json',
        data: {
            firstName: newPersonnelForm.elements[0].value,
            lastName: newPersonnelForm.elements[1].value,
            jobTitle: newPersonnelForm.elements[2].value,
            email: newPersonnelForm.elements[3].value,
            departmentID: newPersonnelForm.elements[4].value
        },

        success: function(result) {
                   
        if (result.status.name == "ok") {
            
            
          // alert(result)
        }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
            console.log(errorThrown)
        } 
        
            });
        });

        $('#editPersonnel').on('click', function() { //ADD NEW DEPARTMENT
            //alert(document.getElementById("emailTxt").value)
        $.ajax({ //retrieve country name based on users click
    
            url: "libs/php/editPersonnel.php",
            type: 'POST',
            dataType: 'json',
            data: {
                firstName: editPersonnelForm.elements[0].value,
                lastName: editPersonnelForm.elements[1].value,
                jobTitle: editPersonnelForm.elements[2].value,
                email: editPersonnelForm.elements[3].value,
                departmentID: departmentsObj[editPersonnelForm.elements[4].value],
                emailOld: editPersonnelForm.elements[5].value
            }, 
    
            success: function(result) {
                       
            if (result.status.name == "ok") {
                
                
              // alert(result)
            }
            
            },
            error: function(jqXHR, textStatus, errorThrown) {
                // your error code
                console.log(errorThrown)
            } 
            
                });
            });

            
            $('#editDepartmentSelect').on('click', function() { //ADD NEW DEPARTMENT
                //alert(document.getElementById("emailTxt").value)
                document.getElementById("departmentOld").defaultValue = selectDepartmentForm.elements[0].value

            
                });

            $('#editDepartment').on('click', function() { //ADD NEW DEPARTMENT
                //alert(document.getElementById("emailTxt").value)
                //document.getElementById("departmentOld").defaultValue = selectDepartmentForm.elements[0].value

            $.ajax({ //retrieve country name based on users click
        
                url: "libs/php/editDepartment.php",
                type: 'POST',
                dataType: 'json',
                data: {
                    department: editDepartmentForm.elements[0].value,
                    departmentOld: editDepartmentForm.elements[1].value

                }, 
        
                success: function(result) {
                           
                if (result.status.name == "ok") {
                    
                    
                  // alert(result)
                }
                
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    // your error code
                    console.log(errorThrown)
                } 
                
                    });
                });

                $('#editLocationSelect').on('click', function() { //ADD NEW DEPARTMENT
                    //alert(document.getElementById("emailTxt").value)
                    document.getElementById("locationOld").defaultValue = selectLocationForm.elements[0].value
    
                
                    });
    
                $('#editLocation').on('click', function() { //ADD NEW DEPARTMENT
                    //alert(document.getElementById("emailTxt").value)
                    //document.getElementById("departmentOld").defaultValue = selectDepartmentForm.elements[0].value
    
                $.ajax({ //retrieve country name based on users click
            
                    url: "libs/php/editLocation.php",
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        location: editLocationForm.elements[0].value,
                        locationOld: editLocationForm.elements[1].value
    
                    }, 
            
                    success: function(result) {
                               
                    if (result.status.name == "ok") {
                        
                        
                      // alert(result)
                    }
                    
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        // your error code
                        console.log(errorThrown)
                    } 
                    
                        });
                    });
            
    
            $('#searchField').on('input', function() { //Search Input Field
                //alert(document.getElementById("emailTxt").value)
                document.getElementById("removeable").remove()
                if(searchForm.elements[0].value == ""){
                    getEveryone()
                }else{
        $.ajax({ //GET Search criteria
    
            url: "libs/php/getSearch.php",
            type: 'POST',
            dataType: 'json',
            data: {
                search: searchForm.elements[0].value
            }, 
        
            success: function(result) {
                       
            if (result.status.name == "ok") {
                console.log(result)
                console.log(result['data'].length)

                for(var i = 0; i < result['data'].length; i++)
           {
            if(i%3 == 0){
                var row = i;
            }else if(i%3 == 1){
                var row = i-1;
         }else{
            var row = i-2;
         }
            const removeable = document.createElement('div');
            removeable.id = 'removeable';

            const div = document.createElement('div');
            div.className = 'row';
            div.id = 'first'+ row;
            
            const div_2 = document.createElement('div');
            div_2.className = 'col-sm-4';
            div_2.id = 'second'+ i;

            const div_3 = document.createElement('div');
            div_3.className = 'panel';
            div_3.id = 'third'+ i;

            const div_4 = document.createElement('div');
            div_4.className = 'panel-body p-t-10';
            div_4.id = 'fourth'+ i;

            const div_5 = document.createElement('div');
            div_5.className = 'media-main';
            div_5.id = 'fifth'+ i;

            const div_6 = document.createElement('div');
            div_6.className = 'info';
            div_6.id = 'sixth'+ i;
            var bigName = document.createElement("h4");
            bigName.innerHTML = result['data'][i]['firstName'] + ' ' + result['data'][i]['lastName'];
            var email = document.createElement("p");
            email.innerHTML = result['data'][i]['email'];
            email.className = 'text-muted';
            var place = document.createElement("p");
            place.innerHTML = result['data'][i]['department'] + " - " + result['data'][i]['location'];
            place.className = 'text-muted';

            var infoButton = document.createElement("button");
            infoButton.type = "button";
            infoButton.className = "information btn btn-primary";
            infoButton.id = 'infoButton' + i;
            infoButton.innerHTML = 'See Info';
            //infoButton.onclick='infoFunction(this)';

            
            const div_7 = document.createElement('div');
            div_7.className = 'pull-right btn-group-sm';
            div_7.id = 'seventh'+ i;

            var x = document.createElement("button");
            x.type = "button";
            x.className = "edit btn btn-primary";
            x.id = 'button' + i;

            var y = document.createElement("i");
            y.className = "fa fa-pencil";

            var g = document.createElement("button");
            g.type = "button";
            g.className = "delete btn btn-danger tooltips";
            g.id = 'buttonDel' + i;

            var h = document.createElement("i");
            h.className = "fa fa-close";

            var line = document.createElement("hr");
           
            document.getElementById('content').appendChild(removeable);
            document.getElementById('removeable').appendChild(div);
            document.getElementById('first'+row).appendChild(div_2);
            document.getElementById('second'+i).appendChild(div_3);
            document.getElementById('third'+i).appendChild(div_4);
            document.getElementById('fourth'+i).appendChild(div_5);
            document.getElementById('fifth'+i).appendChild(div_7);
            document.getElementById('seventh'+i).appendChild(x);
            document.getElementById('button'+i).appendChild(y);

            document.getElementById('seventh'+i).appendChild(g);
            document.getElementById('buttonDel'+i).appendChild(h);

            document.getElementById('fifth'+i).appendChild(div_6);
            document.getElementById('sixth'+i).appendChild(bigName);
            document.getElementById('sixth'+i).appendChild(place);
            //document.getElementById('sixth'+i).appendChild(email);
            
            document.getElementById('sixth'+i).appendChild(infoButton);
            document.getElementById('fourth'+i).appendChild(line);
            
            

           }

           var allButtons = document.querySelectorAll('button[class^=information]');
           console.log("Found", allButtons.length, "div which class starts with “button”.");
           for (var i = 0; i < allButtons.length; i++) {
            allButtons[i].addEventListener('click', function() {
                


              var buttonId = this.id;
              var buttonNum = buttonId.substring(10)
              $('#infoTitle2').html(result['data'][buttonNum]['firstName'] + ' ' + result['data'][buttonNum]['lastName']);
              $('#departmentTxt').html(result['data'][buttonNum]['department']);
                $('#roleTxt').html(result['data'][buttonNum]['jobTitle']);
                $('#locationTxt').html(result['data'][buttonNum]['location']);
                $('#emailTxt').html(result['data'][buttonNum]['email']);
              $('#exampleModal').modal('show');
              console.log("You clicked:", result['data'][buttonNum]['firstName']);

            });
          }

          var editButtons = document.querySelectorAll('button[class^=edit]');
          console.log("Found", editButtons.length, "div which class starts with edit.");
          for (var i = 0; i < editButtons.length; i++) {
            editButtons[i].addEventListener('click', function() {
               


             var editbuttonId = this.id;
             var editbuttonNum = editbuttonId.substring(6)
             console.log(editbuttonId)
             document.getElementById("editFirstName").defaultValue = result['data'][editbuttonNum]['firstName'];
             document.getElementById("editLastName").defaultValue = result['data'][editbuttonNum]['lastName'];
             document.getElementById("editJobTitle").defaultValue = result['data'][editbuttonNum]['jobTitle'];
             document.getElementById("editEmail").defaultValue = result['data'][editbuttonNum]['email'];
             $('#emailTxt').html(result['data'][editbuttonNum]['email']);
             $("#editPersonnelDept").val(defaultValue = result['data'][editbuttonNum]['department']);
             document.getElementById("emailOld").defaultValue = result['data'][editbuttonNum]['email'];             
             $('#editModal').modal('show');
             console.log("You clicked:", result['data'][editbuttonNum]['email']);

           });
         }

          var delButtons = document.querySelectorAll('button[class^=delete]');
          console.log("Found", delButtons.length, "div which class starts with “delete”.");
          for (var i = 0; i < delButtons.length; i++) {
            delButtons[i].addEventListener('click', function() {
               


             var delbuttonId = this.id;
             var delbuttonNum = delbuttonId.substring(9)
             //console.log(delbuttonId)
             $('#delTitle').html('Are you sure you want to delete ' + result['data'][delbuttonNum]['firstName'] + ' ' + result['data'][delbuttonNum]['lastName']);

             $('#departmentDel').html(result['data'][delbuttonNum]['department']);
                $('#roleDel').html(result['data'][delbuttonNum]['jobTitle']);
                $('#locationDel').html(result['data'][delbuttonNum]['location']);
             $('#emailDel').html(result['data'][delbuttonNum]['email']);
             $('#deletePersonnelRealModal').modal('show');
             console.log("You clicked:", result['data'][delbuttonNum]['email']);

           });
         }

            }
            /*
            $('.information').on('click', function () {
                //alert('shaggin');
               $('#exampleModal').modal('show');

               for(var i = 0; i < result['data'].length; i++){
                if(infoButton.id == 'infoButton' + i){
                    console.log(result['data'][i]['firstName'])
                }
               }
   })*/
            },
            error: function(jqXHR, textStatus, errorThrown) {
                // your error code
                console.log(errorThrown)
            } 
            
                });
            }
                });




//day 1 get sql working
//day 2 get list of personnel added to page. get each personel button outputing relative to the button.  
//day 3 
//get adding personel data to modal based on respective users buttons. 
//adding/deleting departments and location. filled out filter with department stuff
//day 4 don't allow deletion of something with dependancies, get personnel adding/deleting to work.
//day 5 editing works - searching works - do a bit of stuff that makes it nicer
//day 6 break
//day 7 get it working on website. fix minor bugs.

//to do - make it look better
//MAYBE - add multi page modals, checkbox filter, add department to search bar, deleted/added successfully modal with reload on close button?