const asyncHandler=(fnc)=>async(req,res,next)=>
{
    try{
        await fnc(req,res,next)
    }
    catch(error)
    {
        console.log(error)
        res.status(error.code||500).json({
            success:false,
            message:error.message
        })
    }
}
export default asyncHandler