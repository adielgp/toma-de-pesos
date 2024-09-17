let i, j;
let array_objetos_pesos="dan_prod_pesos_emp";
let texto_dato_pesos;
let array_campos=['id','fecha','referencia','peso'];
let array_datos_pesos;
let texto_referencia=document.getElementById("textoreferencia");
let texto_pesos=document.getElementById("textopeso");
let tabla_pesos=document.getElementById("tabladatospesos");
let body, tblHeader, tblBody, hilera, celda, texto_celda
let registro_nuevo;
let label_datos=document.getElementById("numerodatos");
let number_dates;
let id_eliminar, id_encontrado;

actualizar_tabla();

function leer_datos(){
    texto_dato_pesos=localStorage.getItem(array_objetos_pesos);
    if(texto_dato_pesos!=null && texto_dato_pesos!="null"){ array_datos_pesos = JSON.parse(texto_dato_pesos); }
    else{ array_datos_pesos=[]; }
}

function actualizar_tabla(){
    leer_datos();
    body = document.getElementsByTagName("body")[0];
    tblHeader = document.createElement("thead");
    hilera = document.createElement("tr");
    for(i=0;i<array_campos.length;i++){
        celda = document.createElement("th");
        textoCelda = document.createTextNode(array_campos[i]);
        celda.appendChild(textoCelda);
        hilera.appendChild(celda)
    }
    tblHeader.appendChild(hilera);
    tblBody=document.createElement("tbody");
    number_dates=array_datos_pesos.length;
    for(i=0;i<number_dates;i++){
        hilera = document.createElement("tr");
        for(j=0;j<array_campos.length;j++){
            celda = document.createElement("td");
            textoCelda = document.createTextNode(array_datos_pesos[i][array_campos[j]]);
            celda.appendChild(textoCelda);
            hilera.appendChild(celda);
        }
        tblBody.appendChild(hilera);
    }
    tabla_pesos.replaceChildren();
    tabla_pesos.appendChild(tblHeader);
    tabla_pesos.appendChild(tblBody);
    body.appendChild(tabla_pesos);
    label_datos.textContent=number_dates;
}

function save_weight(){
    registro_nuevo={};
    if(array_datos_pesos.length>0){ registro_nuevo['id']=array_datos_pesos[array_datos_pesos.length-1]['id']+1; }
    else{ registro_nuevo['id']=0; }
    registro_nuevo['fecha']=new Date();
    registro_nuevo['referencia']=texto_referencia.value;
    registro_nuevo['peso']=parseFloat(texto_pesos.value);
    array_datos_pesos.push(registro_nuevo);
    localStorage.setItem(array_objetos_pesos,JSON.stringify(array_datos_pesos));
    texto_pesos.value="";
    texto_pesos.focus();
    actualizar_tabla();
}

function export_weight(){
    time_running=false;
    time_pause=false;
    let fecha_ahora=texto_fecha_ahora();
    let filename="PESO_"+fecha_ahora+'.xlsx';
    let data=[];
    for(i=0;i<array_datos_pesos.length;i++){
        registro_nuevo={};
        for(j=0;j<array_campos.length;j++){
            registro_nuevo[array_campos[j]]=array_datos_pesos[i][array_campos[j]]
        }
        data.push(registro_nuevo); 
    }
    let ws = XLSX.utils.json_to_sheet(data);
    let wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "SG");
    XLSX.writeFile(wb,filename);
}

function delete_weigh(){
    id_eliminar=parseInt(prompt("Ingresa ID a Eliminar"));
    
    if(id_eliminar>-1){
        id_encontrado=array_datos_pesos.findIndex(elmto => elmto['id']==id_eliminar);
        if(id_encontrado>-1){
            array_datos_pesos.splice(id_encontrado,1);
            alert(`ID: ${id_eliminar} eliminado correctamente`);
        }else{
            alert("ID no registra");
        }
        localStorage.setItem(array_objetos_pesos,JSON.stringify(array_datos_pesos));
    }else if(id_eliminar==-1){
        alert(`Todos los datos eliminados`);
        localStorage.setItem(array_objetos_pesos,null);
    }
    actualizar_tabla(); 
}

function texto_fecha_ahora(){
    let fecha_hoy=new Date();
    let t_mes, t_dia, t_hor, t_min, t_seg;
    if((parseInt(fecha_hoy.getMonth())+1)>9){ t_mes=(parseInt(fecha_hoy.getMonth())+1)+""; }
    else{ t_mes = "0" + (parseInt(fecha_hoy.getMonth())+1); }
    if(fecha_hoy.getDate()>9){ t_dia = fecha_hoy.getDate() +""; }
    else{ t_dia = "0" +  fecha_hoy.getDate(); }
    if(fecha_hoy.getHours()>9){ t_hor = fecha_hoy.getHours() +""; }
    else{ t_hor = "0" +  fecha_hoy.getHours(); }
    if(fecha_hoy.getMinutes()>9){ t_min = fecha_hoy.getMinutes() +""; }
    else{ t_min = "0" +  fecha_hoy.getMinutes(); }
    if(fecha_hoy.getSeconds()>9){ t_seg = fecha_hoy.getSeconds() +""; }
    else{ t_seg = "0" +  fecha_hoy.getSeconds(); }
    
    return fecha_hoy.getFullYear() + t_mes + t_dia + t_hor + t_min + t_seg;
}
