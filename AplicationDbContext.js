const { title } = require('process');
const {Sequelize, DataTypes}=require('sequelize');

const sequelize=new Sequelize({
    dialect:'sqlite',
    storage: './icecream.db'
});

//Definicion de los modelos
const User=
sequelize.define('User',{
  
    id:{
      type:DataTypes.INTEGER,
      allowNull:false,
      primaryKey:true,
      unique:true,
      autoIncrement:true        
    },
    userName:{
      type:DataTypes.STRING,
      allowNull:false            
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false            
    },
    lastName:{
      type:DataTypes.STRING,
      allowNull:false            
    },
    email:{
      type:DataTypes.STRING,
      allowNull:false            
    },
    token:{
      type:DataTypes.STRING,
      allowNull:false            
    },
    photoUrl:{
      type:DataTypes.STRING,
      allowNull:false            
    },
    key:{
      type:DataTypes.STRING,
      allowNull:false            
    }    

});

const  MarkerRequest=
sequelize.define('MarkerRequest',{
  id:{
      type:DataTypes.INTEGER,
      allowNull:false,
      primaryKey:true,
      unique:true,
      autoIncrement:true      
    },
    latitude:{
        type:DataTypes.INTEGER,
        allowNull:false            
      },
    longitude:{
      type:DataTypes.INTEGER,
      allowNull:false
    },
    name:{
      type:DataTypes.STRING,
      allowNull:false
    },
  confirmations:{
      type:DataTypes.INTEGER,
      allowNull:false
    }
});  

const Confirmation=
sequelize.define('Confirmation',{
  id:{
      type:DataTypes.INTEGER,
      allowNull:false,
      primaryKey:true,
      unique:true,
      autoIncrement:true      
    },
  userId:{
      type:DataTypes.INTEGER,
      allowNull:false
    },
  markerId:{
      type:DataTypes.INTEGER,
      allowNull:false
    },
  date:{
      type:DataTypes.STRING,
      allowNull:false
    }
}); 

//Definiendo relaciones
User.hasMany(MarkerRequest,{foreignKey:'userId'});
MarkerRequest.belongsTo(User,{foreignKey:'userId'});

User.hasMany(Confirmation, { foreignKey: 'userId' });
Confirmation.belongsTo(User, { foreignKey: 'userId' });

sequelize.sync({ alter: true })
.then(()=>console.log('Base datos sincronizada'))
.catch(err=>console.log('Error al sincronizar base datos'));


module.exports={sequelize,User,MarkerRequest, Confirmation};